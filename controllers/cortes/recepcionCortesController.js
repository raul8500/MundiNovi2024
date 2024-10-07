const CorteParcial = require('../../schemas/cortes/cortesParcialesSchema')
const CorteGeneral = require('../../schemas/cortes/cortesFinalesSchema');

// Actualizar estado de cortes generales y parciales
exports.updateEstadoCortes = async (req, res) => {
    try {
        const { foliosGenerales, foliosParciales } = req.body;  // Recibir dos arreglos de folios: uno para generales y otro para parciales

        if (!foliosGenerales && !foliosParciales) {
            return res.status(400).send('Faltan parámetros requeridos: foliosGenerales o foliosParciales');
        }

        let resultGenerales, resultParciales;

        // Si hay folios generales, actualizamos los cortes generales
        if (foliosGenerales && foliosGenerales.length > 0) {
            resultGenerales = await CorteGeneral.updateMany(
                { folio: { $in: foliosGenerales } },  // Buscar los cortes por los folios proporcionados
                { $set: { estado: 'recepcion', recibido: true } }  // Cambiar el estado a "recepcion" y marcar como recibido
            );
        }

        // Si hay folios parciales, actualizamos los cortes parciales
        if (foliosParciales && foliosParciales.length > 0) {
            resultParciales = await CorteParcial.updateMany(
                { folio: { $in: foliosParciales } },  // Buscar los cortes por los folios proporcionados
                { $set: { estado: 'recibido', recibido: true } }  // Cambiar el estado a "recibido" y marcar como recibido
            );
        }

        const totalGenerales = resultGenerales ? resultGenerales.nModified : 0;
        const totalParciales = resultParciales ? resultParciales.nModified : 0;
        const totalActualizados = totalGenerales + totalParciales;

        if (totalActualizados === 0) {
            return res.status(404).send('No se encontraron cortes para los folios proporcionados.');
        }

        res.status(200).send(`${totalGenerales} cortes generales y ${totalParciales} cortes parciales actualizados correctamente.`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

