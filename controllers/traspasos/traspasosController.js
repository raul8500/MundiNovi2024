const mongoose = require('mongoose'); // ✅ Importar mongoose
const Producto = require('../../schemas/productosSchema/productosSchema');
const Venta = require('../../schemas/venta/ventaSchema');
const Stock = require('../../schemas/stocksSchema/stocksSchema');
const Kardex = require('../../schemas/kardexSchema/kardexSchema'); // Importar el esquema de Kardex
const Traspaso = require('../../schemas/traspasosSchema/traspasosSchema');

exports.obtenerVentasPorSucursalYFechas = async (req, res) => {
    try {
        const { sucursalOrigenId, sucursalDestinoId, fechaInicio, fechaFinal } = req.params;

        // 1️⃣ **Validar parámetros**
        if (!sucursalOrigenId || !sucursalDestinoId || !fechaInicio || !fechaFinal) {
            return res.status(400).json({ message: 'SucursalOrigenId, SucursalDestinoId, fechaInicio y fechaFinal son obligatorios' });
        }

        // 2️⃣ **Validar y convertir a ObjectId**
        if (!mongoose.isValidObjectId(sucursalOrigenId) || !mongoose.isValidObjectId(sucursalDestinoId)) {
            return res.status(400).json({ message: 'Uno o ambos IDs de sucursal no son válidos.' });
        }

        const sucursalOrigenObjId = new mongoose.Types.ObjectId(sucursalOrigenId);
        const sucursalDestinoObjId = new mongoose.Types.ObjectId(sucursalDestinoId);

        // 3️⃣ **Ajustar rango de fechas en UTC**
        const fechaInicioISO = new Date(fechaInicio);
        fechaInicioISO.setUTCHours(0, 0, 0, 0); // Medianoche UTC del día de inicio

        const fechaFinalISO = new Date(fechaFinal);
        fechaFinalISO.setUTCHours(23, 59, 59, 999); // Último milisegundo UTC del día final

        // 4️⃣ **Obtener todos los productos**
        const productos = await Producto.find({}, 'reference name presentacion volumen peso');

        // 5️⃣ **Buscar ventas por sucursal origen y rango de fechas (en UTC)**
        const ventasOrigen = await Venta.find({
            sucursal: sucursalOrigenObjId,
            fecha: {
                $gte: fechaInicioISO.toISOString(),
                $lte: fechaFinalISO.toISOString()
            }
        });

        const ventasDestino = await Venta.find({
            sucursal: sucursalDestinoObjId,
            fecha: {
                $gte: fechaInicioISO.toISOString(),
                $lte: fechaFinalISO.toISOString()
            }
        });

        // Crear mapas para sumar cantidades vendidas por producto usando `productoId`
        const mapaCantidadesOrigen = {};
        const mapaCantidadesDestino = {};

        ventasOrigen.forEach(venta => {
            venta.productos.forEach(producto => {
                const productoId = producto.productoId.toString();

                if (!mapaCantidadesOrigen[productoId]) {
                    mapaCantidadesOrigen[productoId] = 0;
                }
                mapaCantidadesOrigen[productoId] += producto.cantidad;
            });
        });

        ventasDestino.forEach(venta => {
            venta.productos.forEach(producto => {
                const productoId = producto.productoId.toString();

                if (!mapaCantidadesDestino[productoId]) {
                    mapaCantidadesDestino[productoId] = 0;
                }
                mapaCantidadesDestino[productoId] += producto.cantidad;
            });
        });

        // 6️⃣ **Buscar stock para las sucursales**
        const stockOrigen = await Stock.findOne({ sucursalId: sucursalOrigenObjId });
        const stockDestino = await Stock.findOne({ sucursalId: sucursalDestinoObjId });

        const mapaStockOrigen = stockOrigen?.productos.reduce((mapa, producto) => {
            mapa[producto.reference] = {
                stockMinimo: producto.stockMinimo,
                stockMaximo: producto.stockMaximo
            };
            return mapa;
        }, {}) || {};

        const mapaStockDestino = stockDestino?.productos.reduce((mapa, producto) => {
            mapa[producto.reference] = {
                stockMinimo: producto.stockMinimo,
                stockMaximo: producto.stockMaximo
            };
            return mapa;
        }, {}) || {};

        // 7️⃣ **Buscar la última existencia en Kardex para Origen y Destino**
        const kardexOrigen = await Kardex.aggregate([
            { $match: { sucursal: sucursalOrigenObjId } },
            { $sort: { fecha: -1 } },
            {
                $group: {
                    _id: "$reference",
                    ultimaExistencia: { $first: "$existencia" }
                }
            }
        ]);

        const kardexDestino = await Kardex.aggregate([
            { $match: { sucursal: sucursalDestinoObjId } },
            { $sort: { fecha: -1 } },
            {
                $group: {
                    _id: "$reference",
                    ultimaExistencia: { $first: "$existencia" }
                }
            }
        ]);

        // Crear mapas para las existencias
        const mapaExistenciaOrigen = kardexOrigen.reduce((mapa, registro) => {
            mapa[registro._id] = registro.ultimaExistencia;
            return mapa;
        }, {});

        const mapaExistenciaDestino = kardexDestino.reduce((mapa, registro) => {
            mapa[registro._id] = registro.ultimaExistencia;
            return mapa;
        }, {});

        // 8️⃣ **Mapear resultados finales**
        const resultados = productos.map(producto => {
            const productoId = producto._id.toString();
            return {
                reference: producto.reference,
                name: producto.name,
                presentacion: producto.presentacion,
                volumen: producto.volumen,
                peso: producto.peso,
                cantidadVendidaOrigen: mapaCantidadesOrigen[productoId] || 0,
                cantidadVendidaDestino: mapaCantidadesDestino[productoId] || 0,
                stockMinimoOrigen: mapaStockOrigen[producto.reference]?.stockMinimo || 0,
                stockMaximoOrigen: mapaStockOrigen[producto.reference]?.stockMaximo || 0,
                existenciaOrigen: mapaExistenciaOrigen[producto.reference] || 0,
                stockMinimoDestino: mapaStockDestino[producto.reference]?.stockMinimo || 0,
                stockMaximoDestino: mapaStockDestino[producto.reference]?.stockMaximo || 0,
                existenciaDestino: mapaExistenciaDestino[producto.reference] || 0
            };
        });

        // 🔟 **Respuesta final**
        res.status(200).json({
            ventas: resultados
        });

    } catch (error) {
        console.error('❌ Error al obtener ventas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};


exports.realizarTraspaso = async (req, res) => {
    try {
        const { sucursalOrigen, sucursalDestino, usuarioOrigen, usuarioDestino, observaciones, productos } = req.body;

        console.log('📦 Datos recibidos:', { sucursalOrigen, sucursalDestino, usuarioOrigen, usuarioDestino, observaciones, productos });

        if (!sucursalOrigen || !sucursalDestino || !usuarioOrigen || !usuarioDestino || !productos || productos.length === 0) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios y debe haber al menos un producto.' });
        }

        // Validar los productos
        for (const producto of productos) {
            if (!producto.reference || !producto.name || !producto.presentacion || producto.cantidad <= 0 || producto.existenciaOrigen < producto.cantidad) {
                return res.status(400).json({ message: `Datos inválidos en el producto: ${producto.reference}` });
            }
        }

        // Crear el traspaso
        const nuevoTraspaso = new Traspaso({
            sucursalOrigen,
            sucursalDestino,
            usuarioOrigen,
            usuarioDestino,
            observaciones,
            productos
        });

        await nuevoTraspaso.save();

        // Actualizar existencias
        for (const producto of productos) {
            await Stock.updateOne(
                { sucursalId: sucursalOrigen, 'productos.reference': producto.reference },
                { $inc: { 'productos.$.existencia': -producto.cantidad } }
            );

            await Stock.updateOne(
                { sucursalId: sucursalDestino, 'productos.reference': producto.reference },
                { $inc: { 'productos.$.existencia': producto.cantidad } }
            );
        }

        res.status(201).json({
            message: '✅ Traspaso realizado exitosamente',
            traspasoId: nuevoTraspaso._id
        });
    } catch (error) {
        console.error('❌ Error al realizar el traspaso:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

