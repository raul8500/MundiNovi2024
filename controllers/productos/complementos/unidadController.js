const Unidad = require('../../../schemas/productosSchema/complementosSchema/unidadSchema');

// GET: Obtener todas las unidades
exports.getUnidades = async (req, res) => {
    try {
        const unidades = await Unidad.find();
        res.status(200).json(unidades);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET by ID: Obtener una unidad por ID
exports.getUnidadById = async (req, res) => {
    try {
        const unidad = await Unidad.findById(req.params.id);
        if (!unidad) return res.status(404).json({ message: 'Unidad no encontrada' });
        res.status(200).json(unidad);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST: Crear una nueva unidad
exports.createUnidad = async (req, res) => {
    const { clave, nombre, descripcion } = req.body;

    const unidad = new Unidad({
        clave,
        nombre,
        descripcion
    });

    try {
        const nuevaUnidad = await unidad.save();
        res.status(201).json(nuevaUnidad);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT: Actualizar una unidad existente
exports.updateUnidad = async (req, res) => {
    try {
        const unidad = await Unidad.findById(req.params.id);
        if (!unidad) return res.status(404).json({ message: 'Unidad no encontrada' });

        unidad.clave = req.body.clave || unidad.clave;
        unidad.nombre = req.body.nombre || unidad.nombre;
        unidad.descripcion = req.body.descripcion || unidad.descripcion;

        const unidadActualizada = await unidad.save();
        res.status(200).json(unidadActualizada);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE: Eliminar una unidad
exports.deleteUnidad = async (req, res) => {
    try {
        const unidad = await Unidad.findById(req.params.id);
        if (!unidad) return res.status(404).json({ message: 'Unidad no encontrada' });

        await unidad.remove();
        res.status(200).json({ message: 'Unidad eliminada correctamente' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
