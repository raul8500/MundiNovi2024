
const TipoActa = require('../../schemas/actasAdministrativasSchema/tipoActaSchema');

exports.createTipoActa = async (req, res) => {
    try {
        const { tipo, mensaje } = req.body;

        const nuevoTipoActa = await TipoActa.create({ tipo, mensaje });
        res.status(201).send(nuevoTipoActa);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};


exports.getAllTiposActas = async (req, res) => {
    try {
        const tipos = await TipoActa.find();
        res.status(200).send(tipos);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};


exports.updateTipoActa = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo, mensaje } = req.body;

        const tipoActaActualizado = await TipoActa.findByIdAndUpdate(id, { tipo, mensaje }, { new: true });
        if (!tipoActaActualizado) {
            return res.status(404).send('Tipo de acta no encontrado.');
        }

        res.status(200).send(tipoActaActualizado);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};


exports.deleteTipoActa = async (req, res) => {
    try {
        const { id } = req.params;

        const tipoActaEliminado = await TipoActa.findByIdAndDelete(id);
        if (!tipoActaEliminado) {
            return res.status(404).send('Tipo de acta no encontrado.');
        }

        res.status(200).send({ message: 'Tipo de acta eliminado exitosamente.', tipo: tipoActaEliminado });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};


exports.getTipoActaById = async (req, res) => {
    try {
        const { id } = req.params; // ID del tipo de acta desde la URL
        const tipoActa = await TipoActa.findById(id);

        if (!tipoActa) {
            return res.status(404).send({ message: 'Tipo de acta no encontrado.' });
        }

        res.status(200).send(tipoActa);
    } catch (error) {
        console.error('Error al obtener el tipo de acta:', error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
};