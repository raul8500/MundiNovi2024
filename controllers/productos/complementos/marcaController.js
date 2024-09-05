const Marca = require('../../../schemas/productosSchema/complementosSchema/marcaSchema');

// GET: Obtener todas las marcas
exports.getMarcas = async (req, res) => {
    try {
        const marcas = await Marca.find();
        res.status(200).json(marcas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET by ID: Obtener una marca por ID
exports.getMarcaById = async (req, res) => {
    try {
        const marca = await Marca.findById(req.params.id);
        if (!marca) return res.status(404).json({ message: 'Marca no encontrada' });
        res.status(200).json(marca);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST: Crear una nueva marca
exports.createMarca = async (req, res) => {
    const { clave, nombre, descripcion } = req.body;

    try {
        // Verificar si la clave ya existe
        const claveExistente = await Marca.findOne({ clave });
        if (claveExistente) {
            return res.status(400).json({ message: 'La clave ya está en uso' });
        }

        const marca = new Marca({
            clave,
            nombre,
            descripcion
        });

        const nuevaMarca = await marca.save();
        res.status(201).json(nuevaMarca);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT: Actualizar una marca existente
exports.updateMarca = async (req, res) => {
    const { clave, nombre, descripcion } = req.body;

    try {
        const marca = await Marca.findById(req.params.id);
        if (!marca) return res.status(404).json({ message: 'Marca no encontrada' });

        // Verificar si la nueva clave ya está en uso por otra marca
        if (clave && clave !== marca.clave) {
            const claveExistente = await Marca.findOne({ clave });
            if (claveExistente) {
                return res.status(400).json({ message: 'La clave ya está en uso' });
            }
        }

        // Actualizar los campos de la marca
        marca.clave = clave || marca.clave;
        marca.nombre = nombre || marca.nombre;
        marca.descripcion = descripcion || marca.descripcion;

        const marcaActualizada = await marca.save();
        res.status(200).json(marcaActualizada);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE: Eliminar una marca
exports.deleteMarca = async (req, res) => {
    try {
        const marca = await Marca.findById(req.params.id);
        if (!marca) return res.status(404).json({ message: 'Marca no encontrada' });

        await Marca.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Marca eliminado correctamente' });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message });
    }
};
