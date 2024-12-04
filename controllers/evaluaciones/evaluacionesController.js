const Parametro = require('../../schemas/evaluacionesSchema/parametrosSchema');
const Evaluacion = require('../../schemas/evaluacionesSchema/evaluacionesSchema');

exports.addEvaluacion = async (req, res) => {
    try {
        const { calificaciones, ...body } = req.body;

        // Validar títulos de los parámetros
        const parametrosValidos = await Parametro.find({ activo: true });
        const titulosValidos = parametrosValidos.map(p => p.nombre);

        const calificacionesValidas = calificaciones.every(c => titulosValidos.includes(c.titulo));
        if (!calificacionesValidas) {
            return res.status(400).send('Uno o más parámetros no son válidos.');
        }

        const nuevaEvaluacion = await Evaluacion.create({ ...body, calificaciones });
        res.status(201).send(nuevaEvaluacion);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

exports.getAllEvaluaciones = async (req, res) => {
    try {
        const evaluaciones = await Evaluacion.find()
            .populate('sucursalId') // Ajusta para incluir solo los campos necesarios
            .populate('evaluadorId'); // Ajusta para incluir solo los campos necesarios

        res.status(200).send(evaluaciones);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

exports.getEvaluacionById = async (req, res) => {
    try {
        const id = req.params.id;
        const evaluacion = await Evaluacion.findById(id)
            .populate('sucursalId') // Ajusta para incluir solo los campos necesarios
            .populate('evaluadorId'); // Ajusta para incluir solo los campos necesarios

        if (!evaluacion) {
            return res.status(404).send('Evaluación no encontrada');
        }
        res.status(200).send(evaluacion);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

exports.updateEvaluacion = async (req, res) => {
    try {
        const id = req.params.id;
        const { calificaciones, ...rest } = req.body;

        // Validar títulos de parámetros si se actualizan las calificaciones
        if (calificaciones) {
            const parametrosValidos = await Parametro.find({ activo: true });
            const titulosValidos = parametrosValidos.map(p => p.nombre);

            const calificacionesValidas = calificaciones.every(c => titulosValidos.includes(c.titulo));
            if (!calificacionesValidas) {
                return res.status(400).send('Uno o más parámetros no son válidos.');
            }
        }

        const evaluacionActualizada = await Evaluacion.findByIdAndUpdate(
            id,
            { ...rest, calificaciones },
            { new: true }
        );

        if (!evaluacionActualizada) {
            return res.status(404).send('Evaluación no encontrada');
        }
        res.status(200).send(evaluacionActualizada);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

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
