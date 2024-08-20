const Proveedor = require('../../../schemas/productosSchema/complementosSchema/proveedorSchema');

// GET: Obtener todos los proveedores
exports.getProveedores = async (req, res) => {
    try {
        const proveedores = await Proveedor.find();
        res.status(200).json(proveedores);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET by ID: Obtener un proveedor por ID
exports.getProveedorById = async (req, res) => {
    try {
        const proveedor = await Proveedor.findById(req.params.id);
        if (!proveedor) return res.status(404).json({ message: 'Proveedor no encontrado' });
        res.status(200).json(proveedor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST: Crear un nuevo proveedor
exports.createProveedor = async (req, res) => {
    const { clave, nombre, descripcion } = req.body;

    try {
        // Verificar si la clave ya existe
        const claveExistente = await Proveedor.findOne({ clave });
        if (claveExistente) {
            return res.status(400).json({ message: 'La clave ya está en uso' });
        }

        const proveedor = new Proveedor({
            clave,
            nombre,
            descripcion
        });

        const nuevoProveedor = await proveedor.save();
        res.status(201).json(nuevoProveedor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT: Actualizar un proveedor existente
exports.updateProveedor = async (req, res) => {
    const { clave, nombre, descripcion } = req.body;

    try {
        const proveedor = await Proveedor.findById(req.params.id);
        if (!proveedor) return res.status(404).json({ message: 'Proveedor no encontrado' });

        // Verificar si la nueva clave ya está en uso por otro proveedor
        if (clave && clave !== proveedor.clave) {
            const claveExistente = await Proveedor.findOne({ clave });
            if (claveExistente) {
                return res.status(400).json({ message: 'La clave ya está en uso' });
            }
        }

        // Actualizar los campos del proveedor
        proveedor.clave = clave || proveedor.clave;
        proveedor.nombre = nombre || proveedor.nombre;
        proveedor.descripcion = descripcion || proveedor.descripcion;

        const proveedorActualizado = await proveedor.save();
        res.status(200).json(proveedorActualizado);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE: Eliminar un proveedor
exports.deleteProveedor = async (req, res) => {
    try {
        const proveedor = await Proveedor.findById(req.params.id);
        if (!proveedor) return res.status(404).json({ message: 'Proveedor no encontrado' });

        await proveedor.remove();
        res.status(200).json({ message: 'Proveedor eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
