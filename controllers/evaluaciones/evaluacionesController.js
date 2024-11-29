const Evaluacion = require('../../schemas/evaluacionesSchema/evaluacionesSchema');

// Crear una nueva evaluación
exports.addEvaluacion = async (req, res) => {
    try {
        const body = req.body;
        const nuevaEvaluacion = await Evaluacion.create(body);
        res.status(201).send(nuevaEvaluacion);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};
// Obtener todas las evaluaciones con populate
exports.getAllEvaluaciones = async (req, res) => {
    try {
        const evaluaciones = await Evaluacion.find()
            .populate('sucursalId') // Popula sucursalId con los campos deseados
            .populate('evaluadorId'); // Popula evaluadorId con los campos deseados

        res.status(200).send(evaluaciones);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Obtener una evaluación por ID con populate
exports.getEvaluacionById = async (req, res) => {
    try {
        const id = req.params.id;
        const evaluacion = await Evaluacion.findById(id)
            .populate('sucursalId') // Popula sucursalId con los campos deseados
            .populate('evaluadorId'); // Popula evaluadorId con los campos deseados

        if (!evaluacion) {
            return res.status(404).send('Evaluación no encontrada');
        }
        res.status(200).send(evaluacion);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};


// Actualizar una evaluación por ID
exports.updateEvaluacion = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const evaluacionActualizada = await Evaluacion.findByIdAndUpdate(id, body, { new: true });
        if (!evaluacionActualizada) {
            return res.status(404).send('Evaluación no encontrada');
        }
        res.status(200).send(evaluacionActualizada);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Eliminar una evaluación por ID
exports.deleteEvaluacion = async (req, res) => {
    try {
        const id = req.params.id;
        const evaluacionEliminada = await Evaluacion.findByIdAndDelete(id);
        if (!evaluacionEliminada) {
            return res.status(404).send('Evaluación no encontrada');
        }
        res.status(200).send('Evaluación eliminada exitosamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};
