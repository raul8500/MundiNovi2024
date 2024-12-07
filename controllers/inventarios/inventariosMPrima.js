const Inventario = require('../../schemas/inventariosSchema/inventariosSchema');
const Kardex = require('../../schemas/kardexSchema/kardexSchema');
const MateriaPrima = require('../../schemas/materiasPrimasSchema/materiaPrimaSchema');
const mongoose = require('mongoose');

// Obtener el siguiente folio numérico para el inventario
const getNextFolio = async () => {
    const lastInventario = await Inventario.findOne().sort({ folio: -1 }).select('folio');
    return lastInventario ? lastInventario.folio + 1 : 1; // Si no hay registros, comienza en 1
};

exports.crearOActualizarInventario = async (req, res) => {
    try {
        const { sucursal, productos, encargado, tipo } = req.body;

        if (!sucursal) {
            return res.status(400).send({ message: 'La sucursal es requerida.' });
        }

        if (!encargado) {
            return res.status(400).send({ message: 'El encargado es requerido.' });
        }

        if (!Array.isArray(productos) || productos.length === 0) {
            return res.status(400).send({ message: 'Debe proporcionar materias primas para el inventario.' });
        }

        if (!tipo || typeof tipo !== 'string') {
            return res.status(400).send({ message: 'El tipo es requerido y debe ser un string.' });
        }

        const sucursalId = mongoose.isValidObjectId(sucursal)
            ? new mongoose.Types.ObjectId(sucursal)
            : sucursal;

        // Buscar inventario abierto
        let inventario = await Inventario.findOne({ sucursal: sucursalId, estado: false });

        // Si existe un inventario abierto pero el encargado es diferente, crear un nuevo inventario
        if (inventario && inventario.encargado.toString() !== encargado) {
            inventario = null; // Forzar la creación de un nuevo inventario
        }

        const todasLasMateriasPrimas = await MateriaPrima.find();

        if (!todasLasMateriasPrimas.length) {
            return res.status(404).send({ message: 'No hay materias primas activas para generar el inventario.' });
        }

        const mapaCostos = todasLasMateriasPrimas.reduce((map, materia) => {
            map[materia.clave] = materia.datosFinancieros?.costo || 0;
            return map;
        }, {});

        const movimientosKardex = await Kardex.aggregate([
            { $match: { sucursal: sucursalId } },
            { $sort: { clave: 1, fecha: -1 } },
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

        const nuevasMateriasConMovimiento = productos.map((materia) => {
            const existenciaContable = mapaExistencias[materia.clave] || 0;
            const diferencia = materia.existenciaFisica - existenciaContable;
            const costo = mapaCostos[materia.clave] || 0;
            const importe = diferencia * costo;

            return {
                referencia: materia.clave,
                descripcion: materia.descripcion,
                existenciaFisica: materia.existenciaFisica,
                existenciaContable,
                diferencia,
                costo,
                importe
            };
        });

        if (inventario) {
            const referenciasExistentes = new Set(inventario.productos.map(p => p.clave));

            productos.forEach((materia) => {
                const index = inventario.productos.findIndex(p => p.clave === materia.clave);
                if (index !== -1) {
                    // Actualizar producto existente
                    inventario.productos[index].existenciaFisica = materia.existenciaFisica;
                    inventario.productos[index].existenciaContable = mapaExistencias[materia.clave] || 0;
                } else {
                    // Solo agregar si no existe (nuevo producto)
                    inventario.productos.push({
                        referencia: materia.clave,
                        descripcion: materia.descripcion,
                        existenciaFisica: materia.existenciaFisica || 0,
                        existenciaContable: mapaExistencias[materia.clave] || 0
                    });
                }
            });

            nuevasMateriasConMovimiento.forEach((materiaMov) => {
                const index = inventario.productosConMovimiento.findIndex(p => p.clave === materiaMov.clave);

                if (index !== -1) {
                    // Actualizar producto con movimiento existente
                    inventario.productosConMovimiento[index] = materiaMov;
                } else {
                    // Agregar nuevo producto con movimiento
                    inventario.productosConMovimiento.push(materiaMov);
                }
            });

            inventario.tipo = tipo; // Actualizar el tipo en caso de ser necesario
            await inventario.save();

            return res.status(200).send({
                message: 'Inventario actualizado exitosamente.',
                inventario
            });
        } else {
            const materiasFinales = todasLasMateriasPrimas.map((materia) => {
                const existenciaContable = mapaExistencias[materia.clave] || 0;
                const diferencia = productos.find(p => p.clave === materia.clave)?.existenciaFisica - existenciaContable || 0;
                const costo = mapaCostos[materia.clave] || 0;
                const importe = diferencia * costo;

                return {
                    referencia: materia.clave,
                    descripcion: materia.nombre || materia.descripcion,
                    existenciaFisica: productos.find(p => p.clave === materia.clave)?.existenciaFisica || 0,
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
                tipo, // Guardar el tipo en el nuevo inventario
                productos: materiasFinales,
                productosConMovimiento: nuevasMateriasConMovimiento
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

