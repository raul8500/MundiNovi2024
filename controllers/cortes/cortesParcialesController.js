const CorteParcial = require('../../schemas/cortes/cortesParcialesSchema')

// Crear un nuevo corte parcial
exports.addCorteParcial = async (req, res) => {
    try {
        const body = req.body;
        const nuevoCorteParcial = await CorteParcial.create(body);
        res.status(201).send(nuevoCorteParcial);
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
