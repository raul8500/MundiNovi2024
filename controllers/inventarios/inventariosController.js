const Inventario = require('../../schemas/inventariosSchema/inventariosSchema');
const Kardex = require('../../schemas/kardexSchema/kardexSchema');
const Product = require('../../schemas/productosSchema/productosSchema');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const getNextFolio = async () => {
    const lastInventario = await Inventario.findOne().sort({ folio: -1 }).select('folio');
    return lastInventario ? lastInventario.folio + 1 : 1; // Si no hay registros, comienza en 1
};

exports.crearOActualizarInventario = async (req, res) => {
    try {
        const { sucursal, productos, encargado } = req.body;

        if (!sucursal) {
            return res.status(400).send({ message: 'La sucursal es requerida.' });
        }

        if (!encargado) {
            return res.status(400).send({ message: 'El encargado es requerido.' });
        }

        if (!Array.isArray(productos) || productos.length === 0) {
            return res.status(400).send({ message: 'Debe proporcionar productos para el inventario.' });
        }

        const sucursalId = mongoose.isValidObjectId(sucursal)
            ? new mongoose.Types.ObjectId(sucursal)
            : sucursal;

        let inventario = await Inventario.findOne({ sucursal: sucursalId, estado: false });

        const todosLosProductos = await Product.find({ esActivo: true });

        if (!todosLosProductos.length) {
            return res.status(404).send({ message: 'No hay productos activos para generar el inventario.' });
        }

        const mapaCostos = todosLosProductos.reduce((map, producto) => {
            map[producto.reference] = producto.datosFinancieros?.costo || 0;
            return map;
        }, {});

        const movimientosKardex = await Kardex.aggregate([
            { $match: { sucursal: sucursalId } },
            { $sort: { reference: 1, fecha: -1 } },
            {
                $group: {
                    _id: '$reference',
                    descripcion: { $first: '$nombre' },
                    ultimaExistencia: { $first: '$existencia' }
                }
            }
        ]);

        const mapaExistencias = movimientosKardex.reduce((map, item) => {
            map[item._id] = item.ultimaExistencia || 0;
            return map;
        }, {});

        const nuevosProductosConMovimiento = productos.map(producto => {
            const existenciaContable = mapaExistencias[producto.referencia] || 0;
            const diferencia = producto.existenciaFisica - existenciaContable;
            const costo = mapaCostos[producto.referencia] || 0;
            const importe = diferencia * costo;

            return {
                referencia: producto.referencia,
                descripcion: producto.descripcion,
                existenciaFisica: producto.existenciaFisica,
                existenciaContable,
                diferencia,
                costo,
                importe
            };
        });

        if (inventario) {
            productos.forEach((producto) => {
                const index = inventario.productos.findIndex(p => p.referencia === producto.referencia);

                if (index !== -1) {
                    // Si el producto ya existe en productos, actualizarlo
                    inventario.productos[index].existenciaFisica = producto.existenciaFisica;
                    inventario.productos[index].existenciaContable = mapaExistencias[producto.referencia] || 0;
                } else {
                    // Si el producto no existe en productos, agregarlo
                    inventario.productos.push({
                        referencia: producto.referencia,
                        descripcion: producto.descripcion,
                        existenciaFisica: producto.existenciaFisica || 0,
                        existenciaContable: mapaExistencias[producto.referencia] || 0
                    });
                }
            });

            nuevosProductosConMovimiento.forEach(productoMov => {
                const index = inventario.productosConMovimiento?.findIndex(p => p.referencia === productoMov.referencia);

                if (index !== -1) {
                    // Si el producto ya existe en productosConMovimiento, actualizarlo
                    inventario.productosConMovimiento[index] = productoMov;
                } else {
                    // Si el producto no existe en productosConMovimiento, agregarlo
                    inventario.productosConMovimiento.push(productoMov);
                }
            });

            // Guardar los cambios
            await inventario.save();

            return res.status(200).send({
                message: 'Inventario actualizado exitosamente.',
                inventario
            });
        } else {
            const productosFinales = todosLosProductos.map((producto) => {
                const existenciaContable = mapaExistencias[producto.reference] || 0;
                const diferencia = productos.find(p => p.referencia === producto.reference)?.existenciaFisica - existenciaContable || 0;
                const costo = mapaCostos[producto.reference] || 0;
                const importe = diferencia * costo;

                return {
                    referencia: producto.reference,
                    descripcion: producto.name || producto.description,
                    existenciaFisica: productos.find(p => p.referencia === producto.reference)?.existenciaFisica || 0,
                    existenciaContable,
                    diferencia,
                    costo,
                    importe
                };
            });

            const folio = await getNextFolio();

            inventario = new Inventario({
                folio,
                sucursal: sucursalId,
                encargado: new mongoose.Types.ObjectId(encargado),
                estado: false,
                productos: productosFinales,
                productosConMovimiento: nuevosProductosConMovimiento
            });

            await inventario.save();

            return res.status(201).send({
                message: 'Inventario creado exitosamente.',
                inventario
            });
        }
    } catch (error) {
        console.error('Error al crear o actualizar el inventario:', error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
};


exports.getAllInventarios = async (req, res) => {
    try {
        // Recuperar todos los inventarios
        const inventarios = await Inventario.find()
            .populate('sucursal') // Expandir la sucursal y mostrar solo campos relevantes
            .populate('encargado'); // Expandir el encargado y mostrar solo campos relevantes

        res.status(200).send(inventarios);
    } catch (error) {
        console.error('Error al obtener los inventarios:', error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
};

exports.getInventarioById = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar el inventario por ID
        const inventario = await Inventario.findById(id)
            .populate('sucursal', 'nombre direccion') // Expandir sucursal
            .populate('encargado', 'nombre email'); // Expandir encargado

        if (!inventario) {
            return res.status(404).send({ message: 'Inventario no encontrado.' });
        }

        res.status(200).send(inventario);
    } catch (error) {
        console.error('Error al obtener el inventario por ID:', error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
};

exports.deleteInventario = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar y eliminar el inventario por ID
        const inventarioEliminado = await Inventario.findByIdAndDelete(id);

        if (!inventarioEliminado) {
            return res.status(404).send({ message: 'Inventario no encontrado.' });
        }

        res.status(200).send({ message: 'Inventario eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar el inventario:', error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
};

exports.cambiarEstadoInventario = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (typeof estado !== 'boolean') {
            return res.status(400).send({ message: 'El estado debe ser un valor booleano.' });
        }

        // Buscar y actualizar el estado del inventario
        const inventarioActualizado = await Inventario.findByIdAndUpdate(
            id,
            { estado },
            { new: true } // Devuelve el documento actualizado
        );

        if (!inventarioActualizado) {
            return res.status(404).send({ message: 'Inventario no encontrado.' });
        }

        res.status(200).send({
            message: 'Estado del inventario actualizado exitosamente.',
            inventario: inventarioActualizado
        });
    } catch (error) {
        console.error('Error al cambiar el estado del inventario:', error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
};



