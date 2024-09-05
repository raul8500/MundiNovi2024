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

    try {
        // Verificar si la clave ya existe
        const claveExistente = await Linea.findOne({ clave });
        if (claveExistente) {
            return res.status(400).json({ message: 'La clave ya está en uso' });
        }

        const linea = new Linea({
            clave,
            nombre,
            descripcion
        });

        const nuevaLinea = await linea.save();
        res.status(201).json(nuevaLinea);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT: Actualizar una línea existente
exports.updateLinea = async (req, res) => {
    const { clave, nombre, descripcion } = req.body;

    try {
        const linea = await Linea.findById(req.params.id);
        if (!linea) return res.status(404).json({ message: 'Línea no encontrada' });

        // Verificar si la nueva clave ya está en uso por otra línea
        if (clave && clave !== linea.clave) {
            const claveExistente = await Linea.findOne({ clave });
            if (claveExistente) {
                return res.status(400).json({ message: 'La clave ya está en uso' });
            }
        }

        // Actualizar los campos de la línea
        linea.clave = clave || linea.clave;
        linea.nombre = nombre || linea.nombre;
        linea.descripcion = descripcion || linea.descripcion;

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

        await Linea.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'linea eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
