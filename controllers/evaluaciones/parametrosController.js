const Parametro = require('../../schemas/evaluacionesSchema/parametrosSchema');

exports.addParametro = async (req, res) => {
    try {
        const body = req.body;
        const nuevoParametro = await Parametro.create(body);
        res.status(201).send(nuevoParametro);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

exports.getParametros = async (req, res) => {
    try {
        const parametros = await Parametro.find({ activo: true });
        res.status(200).send(parametros);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

exports.updateParametro = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const parametroActualizado = await Parametro.findByIdAndUpdate(id, body, { new: true });
        if (!parametroActualizado) {
            return res.status(404).send('Parámetro no encontrado');
        }
        res.status(200).send(parametroActualizado);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

exports.deleteParametro = async (req, res) => {
    try {
        const id = req.params.id;
        const parametroEliminado = await Parametro.findByIdAndUpdate(id, { activo: false }, { new: true });
        if (!parametroEliminado) {
            return res.status(404).send('Parámetro no encontrado');
        }
        res.status(200).send('Parámetro eliminado exitosamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

exports.getParametroById = async (req, res) => {
    try {
        const id = req.params.id;
        const parametro = await Parametro.findById(id);

        if (!parametro) {
            return res.status(404).send('Parámetro no encontrado');
        }

        res.status(200).send(parametro);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};