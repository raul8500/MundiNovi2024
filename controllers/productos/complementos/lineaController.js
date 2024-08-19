const Linea = require('../../../schemas/productosSchema/complementosSchema/lineaSchema');

// GET: Obtener todas las líneas
exports.getLineas = async (req, res) => {
    try {
        const lineas = await Linea.find();
        res.status(200).json(lineas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET by ID: Obtener una línea por ID
exports.getLineaById = async (req, res) => {
    try {
        const linea = await Linea.findById(req.params.id);
        if (!linea) return res.status(404).json({ message: 'Línea no encontrada' });
        res.status(200).json(linea);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST: Crear una nueva línea
exports.createLinea = async (req, res) => {
    const { clave, nombre, descripcion } = req.body;

    const linea = new Linea({
        clave,
        nombre,
        descripcion
    });

    try {
        const nuevaLinea = await linea.save();
        res.status(201).json(nuevaLinea);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT: Actualizar una línea existente
exports.updateLinea = async (req, res) => {
    try {
        const linea = await Linea.findById(req.params.id);
        if (!linea) return res.status(404).json({ message: 'Línea no encontrada' });

        linea.clave = req.body.clave || linea.clave;
        linea.nombre = req.body.nombre || linea.nombre;
        linea.descripcion = req.body.descripcion || linea.descripcion;

        const lineaActualizada = await linea.save();
        res.status(200).json(lineaActualizada);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE: Eliminar una línea
exports.deleteLinea = async (req, res) => {
    try {
        const linea = await Linea.findById(req.params.id);
        if (!linea) return res.status(404).json({ message: 'Línea no encontrada' });

        await linea.remove();
        res.status(200).json({ message: 'Línea eliminada correctamente' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
