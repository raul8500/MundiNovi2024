const Impuesto = require('../../../schemas/productosSchema/complementosSchema/impuestoSchema');

// GET: Obtener todos los impuestos
exports.getImpuestos = async (req, res) => {
    try {
        const impuestos = await Impuesto.find();
        res.status(200).json(impuestos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET by ID: Obtener un impuesto por ID
exports.getImpuestoById = async (req, res) => {
    try {
        const impuesto = await Impuesto.findById(req.params.id);
        if (!impuesto) return res.status(404).json({ message: 'Impuesto no encontrado' });
        res.status(200).json(impuesto);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST: Crear un nuevo impuesto
exports.createImpuesto = async (req, res) => {
    const { clave, nombre, descripcion } = req.body;

    try {
        // Verificar si la clave ya existe
        const claveExistente = await Impuesto.findOne({ clave });
        if (claveExistente) {
            return res.status(400).json({ message: 'La clave ya está en uso' });
        }

        const impuesto = new Impuesto({
            clave,
            nombre,
            descripcion
        });

        const nuevoImpuesto = await impuesto.save();
        res.status(201).json(nuevoImpuesto);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT: Actualizar un impuesto existente
exports.updateImpuesto = async (req, res) => {
    const { clave, nombre, descripcion } = req.body;

    try {
        const impuesto = await Impuesto.findById(req.params.id);
        if (!impuesto) return res.status(404).json({ message: 'Impuesto no encontrado' });

        // Verificar si la nueva clave ya está en uso por otro impuesto
        if (clave && clave !== impuesto.clave) {
            const claveExistente = await Impuesto.findOne({ clave });
            if (claveExistente) {
                return res.status(400).json({ message: 'La clave ya está en uso' });
            }
        }

        // Actualizar los campos del impuesto
        impuesto.clave = clave || impuesto.clave;
        impuesto.nombre = nombre || impuesto.nombre;
        impuesto.descripcion = descripcion || impuesto.descripcion;

        const impuestoActualizado = await impuesto.save();
        res.status(200).json(impuestoActualizado);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE: Eliminar un impuesto
exports.deleteImpuesto = async (req, res) => {
    try {
        const impuesto = await Impuesto.findById(req.params.id);
        if (!impuesto) return res.status(404).json({ message: 'Impuesto no encontrado' });

        await impuesto.remove();
        res.status(200).json({ message: 'Impuesto eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
