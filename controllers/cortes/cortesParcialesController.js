const CorteParcial = require('../../schemas/cortes/cortesParcialesSchema')
const CorteGeneral = require('../../schemas/cortes/cortesFinalesSchema');



// Crear un nuevo corte parcial
exports.addCorteParcial = async (req, res) => {
    try {
        let vendedor = req.body.vendedor;
        let folioPadre = '';
        const cortePendiente = await checkCorteUsuarioIniciadoONoFinalizado(vendedor);

        if (cortePendiente) {
            folioPadre = cortePendiente;

            // Verificación de si el total de ventas en efectivo es >= 2000
            const esMayorOIgualA2000 = await checkTotalVentasEfectivo(folioPadre);

            if (esMayorOIgualA2000) {
                console.log('El total de ventas en efectivo es mayor o igual a 2000');
                
                // Generar un nuevo folio para el corte parcial
                const nuevoFolio = await generarFolio();

                // Crear el nuevo corte parcial
                const nuevoCorteParcial = new CorteParcial({
                    folio: nuevoFolio,
                    folioPadre: folioPadre,
                    ...req.body // Pasar el resto del body
                });

                await nuevoCorteParcial.save();

                // Agregar el folio hijo (corte parcial) al CorteFinal
                await agregarFolioHijoACorteFinal(folioPadre, nuevoFolio);

                return res.status(201).json({
                    message: 'Corte parcial creado exitosamente.',
                    corteParcial: nuevoCorteParcial
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

        if (corte && corte.totalVentasEfectivoCortes >= 2000) {
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

async function agregarFolioHijoACorteFinal(folioPadre, folioHijo) {
    try {
        // Buscar el CorteFinal por el folio del padre
        const corteFinal = await CorteGeneral.findOne({ folio: folioPadre });

        if (!corteFinal) {
            throw new Error(`No se encontró un CorteFinal con el folio ${folioPadre}`);
        }

        // Verificar si el total de ventas en efectivo es suficiente para restar 2000
        if (corteFinal.totalVentasEfectivoCortes < 2000) {
            return {
                success: false,
                message: `El total de ventas en efectivo es menor a 2000, no se puede realizar el corte.`
            };
        }

        // Verificar si el folio hijo ya está presente en el arreglo de cortes
        if (!corteFinal.cortes.includes(folioHijo)) {
            // Restar 2000 de totalVentasEfectivoCortes
            corteFinal.totalVentasEfectivoCortes -= 2000;

            // Sumar 2000 a totalVentaCorte
            corteFinal.totalVentaCorte = (corteFinal.totalVentaCorte || 0) + 2000;

            // Agregar el folio hijo al arreglo de cortes
            corteFinal.cortes.push(folioHijo);

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
