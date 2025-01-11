const mongoose = require('mongoose'); // ✅ Importar mongoose
const Producto = require('../../schemas/productosSchema/productosSchema');
const Venta = require('../../schemas/venta/ventaSchema');
const Stock = require('../../schemas/stocksSchema/stocksSchema');
const Kardex = require('../../schemas/kardexSchema/kardexSchema'); // Importar el esquema de Kardex
const Traspaso = require('../../schemas/traspasosSchema/traspasosSchema');

const bwipjs = require('bwip-js');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const os = require('os');

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

async function generarFolio() {
    try {
        const ultimoTraspaso = await Traspaso.findOne().sort({ folio: -1 }).select('folio').lean();
        
        let nuevoFolio = 1000; // Valor inicial predeterminado
        
        if (ultimoTraspaso && ultimoTraspaso.folio && !isNaN(ultimoTraspaso.folio)) {
            nuevoFolio = ultimoTraspaso.folio + 1;
        }

        console.log(`📑 Nuevo Folio Generado: ${nuevoFolio}`);
        return nuevoFolio;
    } catch (error) {
        console.error('❌ Error al generar folio:', error);
        return 1000; // Fallback en caso de error
    }
}

exports.realizarTraspaso = async (req, res) => {
    try {
        const { sucursalOrigen, sucursalDestino, usuarioOrigen, usuarioDestino, observaciones, productos } = req.body;

        console.log('📦 Datos recibidos:', { sucursalOrigen, sucursalDestino, usuarioOrigen, usuarioDestino, observaciones, productos });

        if (!sucursalOrigen || !sucursalDestino || !usuarioOrigen || !usuarioDestino || !productos || productos.length === 0) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios y debe haber al menos un producto.' });
        }

        // ✅ Validar los productos
        for (const producto of productos) {
            if (!producto.reference || !producto.name || !producto.presentacion || producto.cantidad <= 0 || producto.existenciaOrigen < producto.cantidad) {
                return res.status(400).json({ message: `Datos inválidos en el producto: ${producto.reference}` });
            }
        }

        // ✅ Generar Folio Único
        const folio = await generarFolio();

        if (isNaN(folio)) {
            throw new Error('El folio generado no es un número válido.');
        }

        // ✅ Crear el traspaso
        const nuevoTraspaso = new Traspaso({
            folio,
            sucursalOrigen,
            sucursalDestino,
            usuarioOrigen,
            usuarioDestino,
            observaciones,
            productos
        });

        await nuevoTraspaso.save();

        // ✅ Actualizar existencias
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
            traspasoId: nuevoTraspaso._id,
            folio: nuevoTraspaso.folio
        });

    } catch (error) {
        console.error('❌ Error al realizar el traspaso:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

exports.obtenerTraspasosPorFechas = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.params;

        // ✅ Validar parámetros
        if (!fechaInicio || !fechaFin) {
            return res.status(400).json({ message: 'Las fechas de inicio y fin son obligatorias.' });
        }

        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);

        if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
            return res.status(400).json({ message: 'Las fechas proporcionadas no son válidas.' });
        }

        // ✅ Ajustar las fechas para incluir todo el día
        fin.setHours(23, 59, 59, 999);

        // ✅ Buscar traspasos en el rango de fechas
        const traspasos = await Traspaso.find({
            fecha: { $gte: inicio, $lte: fin }
        })
        .populate('sucursalOrigen')
        .populate('sucursalDestino')
        .populate('usuarioOrigen')
        .populate('usuarioDestino')
        .sort({ fecha: -1 });

        if (!traspasos.length) {
            return res.status(404).json({ message: 'No se encontraron traspasos en el rango de fechas especificado.' });
        }

        // ✅ Calcular el total de artículos traspasados
        const totalArticulos = traspasos.reduce((total, traspaso) => {
            const totalPorTraspaso = traspaso.productos.reduce((subtotal, producto) => subtotal + producto.cantidad, 0);
            return total + totalPorTraspaso;
        }, 0);

        res.status(200).json({
            message: '✅ Traspasos obtenidos correctamente',
            totalArticulos,
            traspasos
        });
    } catch (error) {
        console.error('❌ Error al obtener traspasos por fechas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

exports.obtenerTraspasoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'El ID del traspaso es obligatorio.' });
        }

        const traspaso = await Traspaso.findById(id)
            .populate('sucursalOrigen')
            .populate('sucursalDestino')
            .populate('usuarioOrigen')
            .populate('usuarioDestino');

        if (!traspaso) {
            return res.status(404).json({ message: 'Traspaso no encontrado.' });
        }

        res.status(200).json({
            message: '✅ Traspaso obtenido correctamente',
            traspaso
        });
    } catch (error) {
        console.error('❌ Error al obtener el traspaso:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

exports.generarPDFTraspaso = async (req, res) => {
    try {
        const { traspasoId } = req.params;

        // 1️⃣ **Validar parámetros**
        if (!traspasoId || !mongoose.isValidObjectId(traspasoId)) {
            return res.status(400).json({ message: 'El ID del traspaso es obligatorio y debe ser válido.' });
        }

        const traspasoObjId = new mongoose.Types.ObjectId(traspasoId);

        // 2️⃣ **Buscar traspaso en la base de datos con nombres de sucursales**
        const traspaso = await Traspaso.findById(traspasoObjId)
            .populate('sucursalOrigen', 'nombre')
            .populate('sucursalDestino', 'nombre');

        if (!traspaso) {
            return res.status(404).json({ message: 'Traspaso no encontrado.' });
        }

        const nombreSucursalOrigen = traspaso.sucursalOrigen?.nombre || 'Sucursal Origen';
        const nombreSucursalDestino = traspaso.sucursalDestino?.nombre || 'Sucursal Destino';

        // 3️⃣ **Crear PDF Temporal**
        const tempFilePath = path.join(os.tmpdir(), `traspaso_${traspasoId}.pdf`);
        const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 50 });

        const writeStream = fs.createWriteStream(tempFilePath);
        doc.pipe(writeStream);

        let primeraPagina = true;

        // 4️⃣ **Generar etiquetas por producto y cantidad**
        for (const producto of traspaso.productos) {
            const { reference, cantidad } = producto;

            for (let i = 0; i < cantidad; i++) {
                if (!primeraPagina || i > 0) {
                    doc.addPage();
                }
                primeraPagina = false;

                // 🖨️ **Generar Código de Barras**
                const barcodeBuffer = await new Promise((resolve, reject) => {
                    bwipjs.toBuffer({
                        bcid: 'code128',
                        text: reference,
                        scale: 4,
                        height: 80,
                        includetext: false,
                        textxalign: 'center',
                    }, (err, png) => {
                        if (err) return reject(err);
                        resolve(png);
                    });
                });

                // 📌 **Distribución en la Hoja**
                const pageWidth = 842; // Ancho de A4 horizontal
                const pageHeight = 595; // Alto de A4 horizontal

                // 📍 **Código de Barras (Centrado)**
                const barcodeWidth = 400;
                const barcodeHeight = 100;
                const barcodeX = (pageWidth - barcodeWidth) / 2;
                const barcodeY = 200;

                doc.fontSize(40).text(` ${reference}`, { align: 'center', lineGap: 8 });
                doc.fontSize(40).text(`Sucursal Origen: ${nombreSucursalOrigen}`, { align: 'center' });
                doc.fontSize(40).text(`Sucursal Destino: ${nombreSucursalDestino}`, { align: 'center', lineGap: 8 });
                doc.fontSize(40).text(`${traspaso.folio} - : ${new Date(traspaso.fecha).toLocaleDateString()}`, {
                    align: 'center',
                    lineGap: 8,
                });

                doc.moveDown(1);

                // 📦 **Insertar Código de Barras**
                doc.image(barcodeBuffer, barcodeX, barcodeY + 100, {
                    width: barcodeWidth,
                    height: barcodeHeight,
                });

                doc.moveDown(2);
            }
        }

        // 5️⃣ **Finalizar y Enviar PDF**
        doc.end();

        writeStream.on('finish', () => {
            res.download(tempFilePath, `traspaso_${traspasoId}.pdf`, (err) => {
                if (err) {
                    console.error('❌ Error al enviar el PDF:', err);
                    res.status(500).json({ message: 'Error al enviar el PDF.', error: err });
                }

                // 🗑️ **Eliminar archivo temporal**
                fs.unlink(tempFilePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('❌ Error al eliminar el archivo temporal:', unlinkErr);
                    }
                });
            });
        });

        writeStream.on('error', (err) => {
            console.error('❌ Error al generar el PDF:', err);
            res.status(500).json({ message: 'Error al generar el PDF.', error: err });
        });

    } catch (error) {
        console.error('❌ Error en la generación del PDF de códigos de barras:', error);
        res.status(500).json({ message: 'Error en la generación del PDF de códigos de barras.', error });
    }
};

exports.obtenerTodosLosTraspasos = async (req, res) => {
    try {
        // 🔍 Obtener todos los traspasos ordenados por fecha descendente
        const traspasos = await Traspaso.find()
            .populate('sucursalOrigen', 'nombre')
            .populate('sucursalDestino', 'nombre')
            .populate('usuarioOrigen', 'name username')
            .populate('usuarioDestino', 'name username')
            .sort({ fecha: -1 }); // Ordenar de más reciente a más antiguo

        // ✅ Enviar respuesta con los traspasos
        res.status(200).json({
            message: '✅ Traspasos obtenidos correctamente',
            traspasos
        });
    } catch (error) {
        console.error('❌ Error al obtener todos los traspasos:', error);
        res.status(500).json({ message: 'Error interno del servidor', error });
    }
};
