const CorteParcial = require('../../schemas/cortes/cortesParcialesSchema');
const CorteGeneral = require('../../schemas/cortes/cortesFinalesSchema');

// Actualizar estado de cortes generales y parciales
exports.updateEstadoCortes = async (req, res) => {
    try {
        const { foliosGenerales, foliosParciales, recolector } = req.body;  // Recibir dos arreglos de folios: uno para generales y otro para parciales

        console.log('user' + recolector)

        if (!foliosGenerales && !foliosParciales) {
            return res.status(400).send('Faltan parámetros requeridos: foliosGenerales o foliosParciales');
        }

        let resultGenerales, resultParciales;

        // Si hay folios generales, actualizamos los cortes generales
        if (foliosGenerales && foliosGenerales.length > 0) {
            resultGenerales = await CorteGeneral.updateMany(
                { folio: { $in: foliosGenerales } },  // Buscar los cortes por los folios proporcionados
                { $set: { recepcion: true, fecha_recepcion: new Date(), usuario_recepcion: recolector._id } }

            );
        }

        // Si hay folios parciales, actualizamos los cortes parciales
        if (foliosParciales && foliosParciales.length > 0) {
            resultParciales = await CorteParcial.updateMany(
                { folio: { $in: foliosParciales } },  // Buscar los cortes por los folios proporcionados
                { $set: { estado: 'recibido', recibido: true } 
                }

            );
        }

        const totalGenerales = resultGenerales ? resultGenerales.modifiedCount : 0;  // Usar modifiedCount en lugar de nModified
        const totalParciales = resultParciales ? resultParciales.modifiedCount : 0;  // Usar modifiedCount en lugar de nModified
        const totalActualizados = totalGenerales + totalParciales;

        if (totalActualizados === 0) {
            return res.status(404).send('No se encontraron cortes para los folios proporcionados o ya estaban marcados como recibidos.');
        }

        res.status(200).send(`${totalGenerales} cortes generales y ${totalParciales} cortes parciales actualizados correctamente.`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

