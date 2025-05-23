const CorteParcial = require('../../schemas/cortes/cortesParcialesSchema')
const CorteGeneral = require('../../schemas/cortes/cortesFinalesSchema');
const bwipjs = require('bwip-js');
const path = require('path');
const fs = require('fs');

// Obtener todos los cortes parciales
exports.getCortesParciales = async (req, res) => {
    try {
        const cortesParciales = await CorteParcial.find();
        res.status(200).send(cortesParciales);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Obtener un corte parcial por ID
exports.getCorteParcialById = async (req, res) => {
    try {
        const { id } = req.params;
        const corteParcial = await CorteParcial.findById(id);
        if (!corteParcial) {
            return res.status(404).send('Corte parcial no encontrado');
        }
        res.status(200).send(corteParcial);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Actualizar un corte parcial por ID
exports.updateCorteParcial = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const corteParcialActualizado = await CorteParcial.findByIdAndUpdate(id, body, { new: true });
        if (!corteParcialActualizado) {
            return res.status(404).send('Corte parcial no encontrado');
        }
        res.status(200).send(corteParcialActualizado);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Eliminar un corte parcial por ID
exports.deleteCorteParcial = async (req, res) => {
    try {
        const { id } = req.params;
        const corteParcialEliminado = await CorteParcial.findByIdAndDelete(id);
        if (!corteParcialEliminado) {
            return res.status(404).send('Corte parcial no encontrado');
        }
        res.status(200).send('Corte parcial eliminado');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};





// Crear un nuevo corte parcial
exports.addCorteParcial = async (req, res) => {
    try {
        let cantidadCorte = req.body.cantidad
        let vendedor = req.body.vendedor;
        let folioPadre = '';
        const cortePendiente = await checkCorteUsuarioIniciadoONoFinalizado(vendedor);

        console.log('cortePendiente' + cortePendiente)

        if (cortePendiente) {
            folioPadre = cortePendiente;

            // Verificación de si el total de ventas en efectivo es >= 2000
            const esMayorOIgualA2000 = await checkTotalVentasEfectivo(folioPadre);

            if (esMayorOIgualA2000) {
                console.log('El total de ventas en efectivo es mayor o igual a 2000');
                
                // Generar un nuevo folio para el corte parcial
                const nuevoFolio = await generarFolio();

                console.log('Nuevo Folio' + nuevoFolio)

                // Crear el nuevo corte parcial
                const nuevoCorteParcial = new CorteParcial({
                    folio: nuevoFolio,
                    folioPadre: folioPadre,
                    ...req.body // Pasar el resto del body
                });

                await nuevoCorteParcial.save();

                // Generar el código de barras basado en el folio
                const codigoBarrasGenerado = await generarCodigoDeBarras(nuevoFolio);

                // Agregar el folio hijo (corte parcial) al CorteFinal
                await agregarFolioHijoACorteFinal(folioPadre, nuevoFolio, cantidadCorte);

                return res.status(201).json({
                    message: 'Corte parcial creado exitosamente.',
                    corteParcial: nuevoCorteParcial,
                    codigoBarras: codigoBarrasGenerado // Devolver la ruta del código de barras
                });

            } else {
                console.log('El total de ventas en efectivo es menor a 2000');
                return res.status(301).json({
                    message: 'El total de ventas en efectivo es menor a $2000. No es posible realizar el corte parcial.'
                });
            }
        } else {
            return res.status(404).json({
                message: 'No se encontró un corte pendiente para el vendedor.'
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Función para generar el código de barras
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

// Verificar si hay un corte pendiente para un usuario y si hay más de $2000 en caja
exports.verificarCortePendiente = async (req, res) => {
    try {
        const { userId } = req.params; // Obtenemos el ID del usuario de los parámetros

        // Verificar si el usuario tiene un corte general no finalizado
        const cortePendiente = await checkCorteUsuarioIniciadoONoFinalizado(userId);

        console.log(`Corte pendiente encontrado: ${cortePendiente}`); // Depuración

        if (cortePendiente) {
            // Si hay un corte general pendiente, verificar si hay más de $2000 en efectivo
            const esMayorOIgualA2000 = await checkTotalVentasEfectivo(cortePendiente);

            console.log(`¿El total de ventas en efectivo es mayor o igual a 2000?: ${esMayorOIgualA2000}`); // Depuración

            if (esMayorOIgualA2000) {
                // Cambiamos el código de estado a 409 (Conflict)
                return res.status(404).json({
                    message: 'Hay un corte parcial pendiente y más de $2000 en efectivo.',
                    folio: cortePendiente
                });
            } else {
                // Si no hay más de $2000 en efectivo, no hay necesidad de un corte parcial
                return res.status(200).json({
                    message: 'No hay necesidad de corte parcial. El total de ventas en efectivo es menor a $2000.'
                });
            }
        } else {
            // Si no hay corte general pendiente
            return res.status(200).json({
                message: 'No hay cortes pendientes para este usuario.'
            });
        }
    } catch (error) {
        console.error('Error al verificar corte pendiente:', error);
        return res.status(500).json({
            message: 'Error interno del servidor al verificar corte pendiente.'
        });
    }
};



//Funciones extras

async function checkCorteUsuarioIniciadoONoFinalizado(userId) {
    try {
        const corte = await CorteGeneral.findOne({
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

async function checkTotalVentasEfectivo(folio) {
    try {
        const corte = await CorteGeneral.findOne({ folio });

        if (corte && corte.totalVentasEfectivoSinCortes >= 2000) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error al verificar el total de ventas en efectivo:', error);
        throw new Error('Error interno al verificar el total de ventas en efectivo');
    }
}

async function generarFolio() {
    try {
        const ultimoCorteParcial = await CorteParcial.findOne()
            .sort({ folio: -1 })
            .select('folio');

        let nuevoFolio;

        if (ultimoCorteParcial && ultimoCorteParcial.folio) {
            // Si existe un corte parcial, aumentar el folio en 1
            nuevoFolio = parseInt(ultimoCorteParcial.folio) + 1;
        } else {
            nuevoFolio = 1000;
        }

        if (nuevoFolio < 1000 || nuevoFolio > 9999) {
            throw new Error('El folio generado está fuera del rango permitido.');
        }

        return nuevoFolio.toString();

    } catch (error) {
        console.error('Error al generar el folio:', error);
        throw new Error('Error interno al generar el folio.');
    }
}

async function agregarFolioHijoACorteFinal(folioPadre, folioHijo, cantidadCorte) {
    try {
        // Buscar el CorteFinal por el folio del padre
        const corteFinal = await CorteGeneral.findOne({ folio: folioPadre });

        console.log('corteFinal' + corteFinal)


        if (!corteFinal) {
            throw new Error(`No se encontró un CorteFinal con el folio ${folioPadre}`);
        }

        // Verificar si el total de ventas en efectivo es suficiente para restar 2000
        if (corteFinal.totalVentasEfectivoSinCortes < 2000) {
            return {
                success: false,
                message: `El total de ventas en efectivo es menor a 2000, no se puede realizar el corte.`
            };
        }

        // Verificar si el folio hijo ya está presente en el arreglo de cortes
        if (!corteFinal.cortesParciales.includes(folioHijo)) {
            // Restar 2000 de totalVentasEfectivoCortes

            console.log("cantidadCorte" + cantidadCorte)

            corteFinal.totalVentasEfectivoSinCortes -= cantidadCorte;

            console.log('folioHijo' +folioHijo )
            // Agregar el folio hijo al arreglo de cortes
            corteFinal.cortesParciales.push({folio: folioHijo, total: cantidadCorte });

            console.log('corteFinal' + corteFinal)
            // Guardar los cambios
            await corteFinal.save();



            return {
                success: true,
                message: `Folio hijo ${folioHijo} agregado correctamente al CorteFinal con folio ${folioPadre}, se restaron 2000 de totalVentasEfectivoCortes.`
            };
        } else {
            return {
                success: false,
                message: `El folio hijo ${folioHijo} ya está presente en el CorteFinal con folio ${folioPadre}`
            };
        }

    } catch (error) {
        console.error('Error al agregar el folio hijo y actualizar las ventas:', error);
        throw new Error('Error interno al agregar el folio hijo.');
    }
}