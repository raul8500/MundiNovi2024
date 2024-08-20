const TipoProducto = require('../../../schemas/productosSchema/complementosSchema/tipoProductoSchema');

// GET: Obtener todos los tipos de productos
exports.getTipoProductos = async (req, res) => {
    try {
        const tipoProductos = await TipoProducto.find();
        res.status(200).json(tipoProductos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET by ID: Obtener un tipo de producto por ID
exports.getTipoProductoById = async (req, res) => {
    try {
        const tipoProducto = await TipoProducto.findById(req.params.id);
        if (!tipoProducto) return res.status(404).json({ message: 'Tipo de producto no encontrado' });
        res.status(200).json(tipoProducto);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST: Crear un nuevo tipo de producto
exports.createTipoProducto = async (req, res) => {
    const { clave, nombre, descripcion } = req.body;

    try {
        // Verificar si la clave ya existe
        const claveExistente = await TipoProducto.findOne({ clave });
        if (claveExistente) {
            return res.status(400).json({ message: 'La clave ya está en uso' });
        }

        const tipoProducto = new TipoProducto({
            clave,
            nombre,
            descripcion
        });

        const nuevoTipoProducto = await tipoProducto.save();
        res.status(201).json(nuevoTipoProducto);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT: Actualizar un tipo de producto existente
exports.updateTipoProducto = async (req, res) => {
    const { clave, nombre, descripcion } = req.body;

    try {
        const tipoProducto = await TipoProducto.findById(req.params.id);
        if (!tipoProducto) return res.status(404).json({ message: 'Tipo de producto no encontrado' });

        // Verificar si la nueva clave ya está en uso por otro tipo de producto
        if (clave && clave !== tipoProducto.clave) {
            const claveExistente = await TipoProducto.findOne({ clave });
            if (claveExistente) {
                return res.status(400).json({ message: 'La clave ya está en uso' });
            }
        }

        // Actualizar los campos del tipo de producto
        tipoProducto.clave = clave || tipoProducto.clave;
        tipoProducto.nombre = nombre || tipoProducto.nombre;
        tipoProducto.descripcion = descripcion || tipoProducto.descripcion;

        const tipoProductoActualizado = await tipoProducto.save();
        res.status(200).json(tipoProductoActualizado);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE: Eliminar un tipo de producto
exports.deleteTipoProducto = async (req, res) => {
    try {
        const tipoProducto = await TipoProducto.findById(req.params.id);
        if (!tipoProducto) return res.status(404).json({ message: 'Tipo de producto no encontrado' });

        await tipoProducto.remove();
        res.status(200).json({ message: 'Tipo de producto eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
