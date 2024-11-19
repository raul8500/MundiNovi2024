const FormulaProduccion = require('../../schemas/formulasSchema/formulasSchema');
const Kardex = require('../../schemas/kardexSchema/kardexSchema');
const Produccion = require('../../schemas/produccionSchema/produccionSchema');

exports.getFormulasProduccion = async (req, res) => {
    try {
        // Obtener todas las fórmulas de producción con el productoFinal poblado
        const formulas = await FormulaProduccion.find()
            .populate({
                path: 'productoFinal',
                model: 'Product', // Modelo relacionado con productoFinal
                select: 'reference nombre descripcion', // Seleccionar solo los campos necesarios
            })
            .populate('materiasPrimas._id'); // Poblar las materias primas

        // ID de la sucursal "Nave C"
        const sucursalId = '66e1b4986dca15c1b8653494';

        // Mapear las fórmulas y agregar la existencia física
        const formulasConMovimientos = await Promise.all(
            formulas.map(async (formula) => {
                const reference = formula.productoFinal?.reference; // Obtener el campo reference del producto final

                // Buscar el último movimiento en kardex para el producto con el reference y la sucursal específica
                const ultimoMovimientoProducto = await Kardex.findOne({
                    reference: reference,
                    sucursal: sucursalId, // Filtrar por la sucursal "Nave C"
                })
                    .sort({ fecha: -1 }) // Ordenar por fecha descendente
                    .select('existencia fecha'); // Seleccionar existencia y fecha

                // Agregar movimientos a cada materia prima
                const materiasPrimasConMovimientos = await Promise.all(
                    formula.materiasPrimas.map(async (materiaPrima) => {
                        const clave = materiaPrima._id.clave; // Obtener la clave de la materia prima
                        // Buscar el último movimiento en kardex para la materia prima y la sucursal
                        const ultimoMovimientoMateriaPrima = await Kardex.findOne({
                            reference: clave,
                            sucursal: sucursalId, // Filtrar por la sucursal "Nave C"
                        })
                            .sort({ fecha: -1 }) // Ordenar por fecha descendente
                            .select('existencia fecha'); // Seleccionar existencia y fecha
                        return {
                            ...materiaPrima.toObject(),
                            ultimoMovimiento: ultimoMovimientoMateriaPrima || null, // Asigna el movimiento si existe
                        };
                    })
                );

                return {
                    ...formula.toObject(),
                    existencia: ultimoMovimientoProducto ? ultimoMovimientoProducto.existencia : 0,
                    materiasPrimas: materiasPrimasConMovimientos,
                };
            })
        );

        // Responder con las fórmulas y los movimientos
        res.status(200).json(formulasConMovimientos);
    } catch (error) {
        console.error('Error al obtener fórmulas de producción:', error);
        res.status(500).send('Error interno del servidor');
    }
};

exports.getFormulaProduccionById = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID de la fórmula de los parámetros de la solicitud

        // Obtener la fórmula de producción por ID con el productoFinal y materias primas pobladas
        const formula = await FormulaProduccion.findById(id)
            .populate({
                path: 'productoFinal',
                model: 'Product', // Modelo relacionado con productoFinal
                select: 'reference nombre descripcion', // Seleccionar solo los campos necesarios
            })
            .populate('materiasPrimas._id'); // Poblar las materias primas

        if (!formula) {
            return res.status(404).json({ error: 'Fórmula de producción no encontrada' });
        }

        // ID de la sucursal "Nave C"
        const sucursalId = '66e1b4986dca15c1b8653494';

        // Obtener el último movimiento en kardex para el producto final
        const reference = formula.productoFinal?.reference; // Obtener el campo reference del producto final
        const ultimoMovimientoProducto = await Kardex.findOne({
            reference: reference,
            sucursal: sucursalId, // Filtrar por la sucursal "Nave C"
        })
            .sort({ fecha: -1 }) // Ordenar por fecha descendente
            .select('existencia fecha'); // Seleccionar existencia y fecha

        // Agregar movimientos a cada materia prima
        const materiasPrimasConMovimientos = await Promise.all(
            formula.materiasPrimas.map(async (materiaPrima) => {
                const clave = materiaPrima._id.clave; // Obtener la clave de la materia prima

                // Buscar el último movimiento en kardex para la materia prima y la sucursal
                const ultimoMovimientoMateriaPrima = await Kardex.findOne({
                    reference: clave,
                    sucursal: sucursalId, // Filtrar por la sucursal "Nave C"
                })
                    .sort({ fecha: -1 }) // Ordenar por fecha descendente
                    .select('existencia fecha'); // Seleccionar existencia y fecha

                return {
                    ...materiaPrima.toObject(),
                    ultimoMovimiento: ultimoMovimientoMateriaPrima || null, // Asigna el movimiento si existe
                };
            })
        );

        // Construir la respuesta con los datos completos
        const formulaConMovimientos = {
            ...formula.toObject(),
            existencia: ultimoMovimientoProducto ? ultimoMovimientoProducto.existencia : 0,
            materiasPrimas: materiasPrimasConMovimientos,
        };

        // Responder con la fórmula y los movimientos
        res.status(200).json(formulaConMovimientos);
    } catch (error) {
        console.error('Error al obtener fórmula de producción por ID:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// Función para generar un folio único de 7 dígitos
const generateFolio = async () => {
    let folio;
    let folioExistente;

    do {
        folio = String(Math.floor(1000000 + Math.random() * 9000000)); // Generar folio de 7 dígitos
        folioExistente = await Kardex.findOne({ folio });
    } while (folioExistente);

    return folio;
};

exports.registrarProduccion = async (req, res) => {
    try {
        const { claveProducto, nombreProducto, costoUnidad, cantidadSugerida, productos, userInfo } = req.body;

        // Validaciones básicas
        if (!claveProducto || !cantidadSugerida || !productos || !userInfo) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        if (cantidadSugerida <= 0) {
            return res.status(400).json({ error: 'La cantidad sugerida debe ser mayor a 0.' });
        }

        if (!Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({ error: 'Debe incluir al menos una materia prima.' });
        }

        // Obtener el último folio registrado para Producción
        const ultimaProduccion = await Produccion.findOne()
            .sort({ folio: -1 })
            .select('folio');

        const ultimoFolio = ultimaProduccion ? parseInt(ultimaProduccion.folio || '0', 10) : 0;
        const nuevoFolio = ultimoFolio + 1;

        // Generar el número de lote
        const fechaActual = new Date();
        const numeroLote = `${fechaActual.getDate()}-${fechaActual.getMonth() + 1}-${fechaActual.getFullYear()}-${nuevoFolio}`;

        // Registrar movimientos de salida en el Kardex y construir las materias primas con su folio de movimiento
        const materiasPrimasConFolio = await Promise.all(
            productos.map(async (producto) => {
                const { clave, proporcion, nombre } = producto;

                // Obtener el último movimiento en Kardex para calcular la nueva existencia
                const ultimoMovimiento = await Kardex.findOne({ reference: clave })
                    .sort({ fecha: -1 });

                const existenciaAnterior = ultimoMovimiento ? ultimoMovimiento.existencia : 0;
                const nuevaExistencia = existenciaAnterior - proporcion;

                if (nuevaExistencia < 0) {
                    throw new Error(`La materia prima con clave "${clave}" no tiene suficiente existencia para la salida.`);
                }

                // Generar un folio único para este movimiento
                const folioMovimiento = String(Math.floor(1000000 + Math.random() * 9000000));

                // Crear el nuevo movimiento en Kardex
                const nuevoMovimiento = new Kardex({
                    reference: clave,
                    nombre,
                    movimiento: 'Salida Producción',
                    folio: folioMovimiento,
                    costoUnitario: costoUnidad,
                    fecha: fechaActual,
                    descripcion: `Producción de ${claveProducto} - Lote ${numeroLote}`,
                    cantidad: -proporcion, // Salida
                    existencia: nuevaExistencia,
                    sucursal: '66e1b4986dca15c1b8653494', // ID de la sucursal "Nave C"
                    usuario: userInfo._id,
                });

                // Guardar el movimiento en Kardex
                const movimientoGuardado = await nuevoMovimiento.save();

                // Retornar la materia prima con el folio del movimiento y su nombre
                return {
                    clave,
                    nombre,
                    cantidad: proporcion,
                    folio: movimientoGuardado.folio,
                };
            })
        );

        // Construir el objeto de producción
        const produccion = new Produccion({
            fechaHora: fechaActual,
            claveProducto,
            nombreProducto,
            cantidad: cantidadSugerida,
            folio: nuevoFolio.toString(),
            numeroLote,
            usuario: userInfo._id,
            materiasPrimas: materiasPrimasConFolio,
        });

        // Guardar la producción en la base de datos
        const produccionGuardada = await produccion.save();

        // Responder con el objeto creado
        res.status(201).json({
            message: 'Producción registrada exitosamente y movimientos de Kardex actualizados.',
            produccion: produccionGuardada,
        });
    } catch (error) {
        console.error('Error al registrar la producción:', error);
        res.status(500).json({ error: error.message || 'Error interno del servidor.' });
    }
};

exports.confirmarProduccion = async (req, res) => {
    try {
        const { produccionId } = req.params;

        // Validar que el ID de producción esté presente
        if (!produccionId) {
            return res.status(400).json({ error: 'El ID de producción es obligatorio.' });
        }

        // Obtener la producción por ID
        const produccion = await Produccion.findById(produccionId).populate('usuario');
        if (!produccion) {
            return res.status(404).json({ error: 'Producción no encontrada.' });
        }

        if (produccion.Estado === 2) {
            return res.status(400).json({ error: 'La producción ya fue confirmada.' });
        }

        // Obtener el último movimiento del producto en el Kardex
        const ultimoMovimiento = await Kardex.findOne({ reference: produccion.claveProducto })
            .sort({ fecha: -1 });

        const nuevaExistencia = ultimoMovimiento
            ? ultimoMovimiento.existencia + produccion.cantidad
            : produccion.cantidad;

        // Crear un nuevo movimiento en el Kardex
        const nuevoMovimiento = new Kardex({
            reference: produccion.claveProducto,
            nombre: produccion.nombreProducto,
            movimiento: 'Entrada Producción',
            folio: produccion.folio,
            cantidad: produccion.cantidad,
            existencia: nuevaExistencia,
            descripcion: `Confirmación de producción - Lote ${produccion.numeroLote}`,
            fecha: new Date(),
            sucursal: '66e1b4986dca15c1b8653494', // ID de la sucursal "Nave C"
            usuario: produccion.usuario._id,
            costoUnitario: ultimoMovimiento?.costoUnitario || 0,
        });

        // Guardar el movimiento en el Kardex
        await nuevoMovimiento.save();

        // Actualizar el estado de la producción a "Producido"
        produccion.Estado = 2; // Estado: Producido
        await produccion.save();

        res.status(201).json({
            message: 'Producción confirmada exitosamente y Kardex actualizado.',
            produccion,
        });
    } catch (error) {
        console.error('Error al confirmar la producción:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};


exports.cancelarProduccion = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar la producción por ID
        const produccion = await Produccion.findById(id);
        if (!produccion) {
            return res.status(404).json({ error: 'Producción no encontrada.' });
        }

        if (produccion.Estado === 2) {
            return res.status(400).json({ error: 'Esta producción ya fue cancelada previamente.' });
        }

        // Eliminar los movimientos en Kardex relacionados con las materias primas
        await Promise.all(
            produccion.materiasPrimas.map(async (materiaPrima) => {
                const { folio } = materiaPrima;

                // Buscar y eliminar el movimiento en Kardex por su folio
                const movimientoEliminado = await Kardex.findOneAndDelete({ folio });
                if (!movimientoEliminado) {
                    console.warn(`Movimiento no encontrado en Kardex para el folio "${folio}".`);
                }
            })
        );

        // Actualizar el estado de la producción a "cancelado"
        produccion.Estado = 3; // Estado: Cancelado
        await produccion.save();

        res.status(200).json({ message: 'Producción cancelada y movimientos eliminados del Kardex exitosamente.' });
    } catch (error) {
        console.error('Error al cancelar la producción:', error);
        res.status(500).json({ error: error.message || 'Error interno del servidor.' });
    }
};


exports.getAllProducciones = async (req, res) => {
    try {
        // Obtener todas las producciones
        const producciones = await Produccion.find()
            .populate('usuario', 'name username') // Poblamos usuario para ver detalles del usuario
            .populate('materiasPrimas', 'clave nombre cantidad folio') // Poblamos las materias primas
            .sort({ fechaHora: -1 }); // Ordenar por fecha descendente

        if (!producciones || producciones.length === 0) {
            return res.status(404).json({ message: 'No se encontraron producciones registradas.' });
        }

        res.status(200).json(producciones);
    } catch (error) {
        console.error('Error al obtener todas las producciones:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

exports.getProduccionById = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar la producción por su ID
        const produccion = await Produccion.findById(id)
            .populate('usuario', 'name username') // Poblamos usuario para ver detalles del usuario
            .populate('materiasPrimas', 'clave nombre cantidad folio'); // Poblamos las materias primas

        if (!produccion) {
            return res.status(404).json({ message: 'Producción no encontrada.' });
        }

        res.status(200).json(produccion);
    } catch (error) {
        console.error('Error al obtener la producción por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

exports.eliminarProduccion = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar y eliminar la producción
        const produccionEliminada = await Produccion.findByIdAndDelete(id);
        if (!produccionEliminada) {
            return res.status(404).json({ error: 'Producción no encontrada.' });
        }

        res.status(200).json({ message: 'Producción eliminada definitivamente.', produccion: produccionEliminada });
    } catch (error) {
        console.error('Error al eliminar la producción:', error);
        res.status(500).json({ error: error.message || 'Error interno del servidor.' });
    }
};

