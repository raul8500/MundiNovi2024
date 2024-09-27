const CorteParcial = require('../../schemas/cortes/cortesParcialesSchema')
const CorteFinal = require('../../schemas/cortes/cortesFinalesSchema');

// Obtener todos los cortes finales por fecha de inicio/fin y sucursal
exports.getCortesFinales = async (req, res) => {
    try {
        const { fechaInicio, fechaFin, sucursalId } = req.query;

        // Validar que la sucursal y las fechas se proporcionen
        if (!fechaInicio || !fechaFin || !sucursalId) {
            return res.status(400).send('Fecha de inicio, fecha de fin y sucursal son requeridos');
        }

        // Convertir las fechas a objetos Date
        const fechaInicioDate = new Date(fechaInicio);
        const fechaFinDate = new Date(fechaFin);

        // Validar las fechas
        if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
            return res.status(400).json({ error: 'Fecha de inicio o fecha final inválida.' });
        }

        // Ajustar las horas de las fechas
        fechaInicioDate.setUTCHours(0, 0, 0, 0); // Comienza el día a medianoche
        fechaFinDate.setUTCHours(23, 59, 59, 999); // Termina el día al final

        // Crear la consulta para buscar los cortes finales donde la `fecha_inicial` esté entre la `fechaInicio` y `fechaFin`
        const query = {
            fecha_inicial: {
                $gte: fechaInicioDate.toISOString(), // Mayor o igual a la fecha de inicio
                $lte: fechaFinDate.toISOString(),    // Menor o igual a la fecha de fin
            },
            sucursal: sucursalId,
        };

        // Buscar los cortes finales según la consulta
        const cortesFinales = await CorteFinal.find(query)
            .populate('sucursal', 'nombre') // Obtener más detalles de la sucursal
            .sort({ fecha_inicial: -1 });   // Ordenar los resultados por fecha_inicial de manera descendente

        res.status(200).send(cortesFinales);
    } catch (error) {
        console.error('Error al obtener los cortes finales:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// Obtener un corte final por ID
exports.getCorteFinalById = async (req, res) => {
    try {
        const { id } = req.params;
        const corteFinal = await CorteFinal.findById(id);

        if (!corteFinal) {
            return res.status(404).send('Corte final no encontrado');
        }

        res.status(200).send(corteFinal);
    } catch (error) {
        console.error('Error al obtener el corte final por ID:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// Crear reporte
exports.addCorteFinal = async (req, res) => {
    try {
        const userId = req.body.userId;  // Asegúrate de obtener el userId correctamente
        const body = req.body.cantidad;
        const observaciones = req.body.observaciones;

        // Verificar si el usuario ya tiene un corte iniciado o no finalizado
        const corteAbierto = await checkCorteUsuarioIniciadoONoFinalizado(userId);

        if (corteAbierto) {
            // Si hay un corte abierto, actualizamos el corteFinal y la fecha_final.
            const corteActualizado = await CorteFinal.findOneAndUpdate(
                { folio: corteAbierto },
                {
                    $set: {
                        'corteFinal': {
                            cantidad: body,
                            observaciones: observaciones
                        },
                        'fecha_final': new Date()  // Actualiza la fecha_final con la fecha actual
                    },
                    $inc: {
                        'totalVentasEfectivoCortes': -body,  // Resta el valor de body de totalVentasEfectivoCortes
                        'totalVentaCorte': body  // Suma el valor de body a totalVentaCorte
                    }
                },
                { new: true, upsert: true }  // upsert asegura que si no existe corteFinal, lo creará
            );

            // Retorna los datos del corte actualizado
            return res.status(200).json({
                message: 'Corte final actualizado exitosamente.',
                corte: {
                    corteActualizado
                }
            });
        } else {
            // Si no existe un corte abierto, devuelve un error 409 Conflict
            return res.status(409).json({
                error: 'No se puede hacer un corte final porque no existe un corte abierto.'
            });
        }
    } catch (error) {
        console.error('Error al crear o actualizar el corte final:', error);
        return res.status(500).send('Error interno del servidor');
    }
};



// Actualizar un corte final por ID
exports.updateCorteFinalById = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;

        // Buscar el corte final por ID y actualizarlo
        const corteFinalActualizado = await CorteFinal.findByIdAndUpdate(id, body, { new: true });

        if (!corteFinalActualizado) {
            return res.status(404).send('Corte final no encontrado');
        }

        res.status(200).send(corteFinalActualizado);
    } catch (error) {
        console.error('Error al actualizar el corte final:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// Eliminar un corte final por ID
exports.deleteCorteFinalById = async (req, res) => {
    try {
        const { id } = req.params;

        const corteFinalEliminado = await CorteFinal.findByIdAndDelete(id);

        if (!corteFinalEliminado) {
            return res.status(404).send('Corte final no encontrado');
        }

        res.status(200).send('Corte final eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar el corte final:', error);
        res.status(500).send('Error interno del servidor');
    }
};

async function checkCorteUsuarioIniciadoONoFinalizado(userId) {
    try {
        const corte = await CorteFinal.findOne({
            usuario: userId,
            folio: { $exists: true },  // Asegura que el folio exista (es decir, que el corte esté iniciado)
            fecha_final: { $exists: false }  // Verifica que el corte no esté finalizado
        });

        // Si existe un corte iniciado y no finalizado, retorna el folio
        if (corte) {
            return corte.folio;  // Devolver el folio del corte
        }

        // Si no hay corte iniciado ni pendiente, retorna null
        return null;
    } catch (error) {
        console.log('Error al buscar corte:', error);
        throw new Error('Error interno del servidor');
    }
}
