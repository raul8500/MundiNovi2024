const Egreso = require('../../schemas/egresosSchema/egresosSchema');

// Crear un nuevo egreso
exports.addEgreso = async (req, res) => {
    try {
        const body = req.body;
        const nuevoEgreso = await Egreso.create(body);
        res.status(201).send(nuevoEgreso);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Obtener todos los egresos
exports.getEgresos = async (req, res) => {
    try {
        const egresos = await Egreso.find().populate('categoria').populate('responsable');
        res.status(200).send(egresos);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Obtener un egreso por ID
exports.getEgresoById = async (req, res) => {
    try {
        const { id } = req.params;
        const egreso = await Egreso.findById(id).populate('categoria').populate('responsable');
        if (!egreso) {
            return res.status(404).send('Egreso no encontrado');
        }
        res.status(200).send(egreso);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Actualizar un egreso por ID
exports.updateEgreso = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const egresoActualizado = await Egreso.findByIdAndUpdate(id, body, { new: true }).populate('categoria').populate('responsable');
        if (!egresoActualizado) {
            return res.status(404).send('Egreso no encontrado');
        }
        res.status(200).send(egresoActualizado);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Eliminar un egreso por ID
exports.deleteEgreso = async (req, res) => {
    try {
        const { id } = req.params;
        const egresoEliminado = await Egreso.findByIdAndDelete(id);
        if (!egresoEliminado) {
            return res.status(404).send('Egreso no encontrado');
        }
        res.status(200).send('Egreso eliminado');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};
