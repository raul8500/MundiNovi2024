const CorteParcial = require('../../schemas/cortes/cortesParcialesSchema')
const CorteFinal = require('../../schemas/cortes/cortesFinalesSchema');
const Indicadores = require('../../schemas/cortes/indicadoresSchema');

const bwipjs = require('bwip-js');
const path = require('path');
const fs = require('fs');

// Crear o actualizar el reporte de corte final con código de barras
exports.addCorteFinal = async (req, res) => {
    try {
        const userId = req.body.userId;
        const body = req.body.cantidad;
        const observaciones = req.body.observaciones;

        // Verificar si el usuario ya tiene un corte iniciado o no finalizado
        const corteAbierto = await checkCorteUsuarioIniciadoONoFinalizado(userId);

        if (corteAbierto) {
            const corteActualizado = await CorteFinal.findOneAndUpdate(
                { folio: corteAbierto },
                {
                    $set: {
                        'corteFinal': {
                            corte_total: body,
                            observaciones: observaciones
                        },
                        'fecha_final': new Date()
                    },
                    $inc: {
                        'totalVentasEfectivoSinCortes': -body,
                        'totalVentaCorte': body
                    }
                },
                { new: true, upsert: true }
            );

            // Generar el código de barras
            const codigoBarras = await generarCodigoDeBarras(corteAbierto);

            return res.status(200).json({
                message: 'Corte final actualizado exitosamente.',
                corte: corteActualizado,
                codigoBarras // Incluir el código de barras en la respuesta
            });
        } else {
            return res.status(409).json({
                error: 'No se puede hacer un corte final porque no existe un corte abierto.'
            });
        }
    } catch (error) {
        console.error('Error al crear o actualizar el corte final:', error);
        return res.status(500).send('Error interno del servidor');
    }
};

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

        // Paso 1: Obtener los indicadores para la sucursal
        const indicadores = await Indicadores.findOne({ sucursalId });

        // Paso 2: Buscar los cortes finales según la consulta
        let cortesFinales = await CorteFinal.find(query)
            .populate('usuario', 'username') // Obtener más detalles de la sucursal
            .populate('usuario_recepcion', 'username') // Obtener más detalles de la sucursal
            .sort({ fecha_inicial: -1 });   // Ordenar los resultados por fecha_inicial de manera descendente

        // Paso 3: Iterar sobre cada corte final y buscar los detalles de los cortes parciales si existen
        cortesFinales = await Promise.all(cortesFinales.map(async (corte) => {
            
            // Asignar los indicadores de la sucursal
            const indicadoresSucursal = indicadores ? {
                verde: indicadores.verde,
                naranja: indicadores.naranja,
                rojo: indicadores.rojo,
            } : { verde: 0, naranja: 0, rojo: 0 }; // Si no hay indicadores, asignar 0

            if (corte.cortesParciales && corte.cortesParciales.length > 0) {
            
                // Hacer un map sobre el array de cortesParciales
                const cortesParcialesData = await Promise.all(corte.cortesParciales.map(async (cp) => {
                    // Para cada folio, buscar el CorteParcial correspondiente
                    const corteParcial = await CorteParcial.findOne({ folio: cp.folio });
            
                    // Si no se encuentra el corte parcial, puedes decidir qué hacer, por ejemplo, devolver null o un objeto vacío
                    if (!corteParcial) {
                        return { folio: cp.folio, corteParcial: null };  // Puedes personalizar lo que se retorna si no se encuentra
                    }
            
                    return corteParcial;
                }));

                // Incluir los indicadores de la sucursal en cada corte
                return { 
                    ...corte.toObject(),
                    cortesParciales: cortesParcialesData,
                    indicadores: indicadoresSucursal, // Asignamos los indicadores a cada corte
                };
            } else {
                // Si no hay cortes parciales, asignar los indicadores directamente
                return { 
                    ...corte.toObject(),
                    cortesParciales: [],
                    indicadores: indicadoresSucursal,
                };
            }
        }));

        // Enviar la respuesta con los cortes finales y sus cortes parciales
        res.status(200).json(cortesFinales);
    } catch (error) {
        console.error('Error al obtener los cortes finales:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// Obtener el corte final por su ID
exports.getCorteFinalById = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar el corte final por su ID
        const corteFinal = await CorteFinal.findById(id)
            .populate('usuario', 'username')
            .populate('sucursal', 'nombre')
            .exec();

        if (!corteFinal) {
            return res.status(404).json({ error: 'Corte final no encontrado' });
        }

        // Devolver el corte final encontrado
        res.status(200).json(corteFinal);
    } catch (error) {
        console.error('Error al obtener el corte final:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
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

exports.getResumenCorte = async (req, res) => {
    try {
        // Asegúrate de obtener el userId correctamente desde el req
        const userId = req.params.userId; // Ajusta según tu lógica

        // Verifica si hay un corte abierto para el usuario
        const corteAbierto = await checkCorteUsuarioIniciadoONoFinalizado(userId);

        let corte;
        if (corteAbierto != null) {
            // Encuentra el corte final no finalizado o según tus criterios
            corte = await CorteFinal.findOne({ folio: corteAbierto});
        }

        // Responde con el corte encontrado o con un mensaje adecuado si no hay corte
        if (corte) {
            return res.status(200).json({ success: true, data: corte });
        } else {
            return res.status(404).json({ success: false, message: 'No se encontró un corte abierto para el usuario' });
        }
    } catch (error) {
        console.error('Error al buscar corte:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// Finalizar un corte de venta
exports.finalizarCorte = async (req, res) => {
    try {
        const { id, totalVales } = req.body;

        // Validar que se proporcionen el id y el total de vales
        if (!id || totalVales === undefined) {
            return res.status(400).send('El id del corte y el total de vales son requeridos');
        }

        // Buscar el corte por su ID
        const corte = await CorteFinal.findById(id);

        // Validar si el corte existe
        if (!corte) {
            return res.status(404).json({ error: 'Corte no encontrado' });
        }

        // Actualizar el estado del corte a finalizado (true)
        corte.estado = true;

        // Si se proporciona el total de vales, se lo asignamos al corte
        if (totalVales !== undefined) {
            corte.vales = totalVales;
        }

        // Guardar los cambios en la base de datos
        await corte.save();

        // Responder con éxito
        res.status(200).json({ message: 'Corte finalizado correctamente' });
    } catch (error) {
        console.error('Error al finalizar el corte:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};



//Funciones extra 

const generarCodigoDeBarras = async (folio) => {
    try {
        const nombreArchivo = path.join(__dirname, `../../public/img/archivos/${folio}.png`);

        return new Promise((resolve, reject) => {
            bwipjs.toBuffer({
                bcid: 'code128',       // Tipo de código de barras
                text: folio,           // Texto que irá en el código de barras
                scale: 3,              // Escala del código de barras
                height: 10,            // Altura del código de barras
                includetext: true,     // Incluye el texto en la imagen
                textxalign: 'center',  // Alinea el texto al centro
            }, function (err, png) {
                if (err) {
                    console.error('Error al generar el código de barras: ', err);
                    return reject(err);
                }

                // Guardar la imagen en el sistema de archivos
                fs.writeFile(nombreArchivo, png, (err) => {
                    if (err) {
                        console.error('Error al guardar el archivo: ', err);
                        return reject(err);
                    }

                    // Devolver la ruta del archivo generado
                    resolve(nombreArchivo);
                });
            });
        });

    } catch (error) {
        console.error('Error en la generación del código de barras:', error);
        throw error;
    }
};