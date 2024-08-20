const Categoria = require('../../../schemas/productosSchema/complementosSchema/categoriaSchema'); // Cambia la ruta y el modelo según la entidad

// GET: Obtener todas las categorías
exports.getCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find();
        res.status(200).json(categorias);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET by ID: Obtener una categoría por ID
exports.getCategoriaById = async (req, res) => {
    try {
        const categoria = await Categoria.findById(req.params.id);
        if (!categoria) return res.status(404).json({ message: 'Categoría no encontrada' });
        res.status(200).json(categoria);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST: Crear una nueva categoría
exports.createCategoria = async (req, res) => {
    const { clave, nombre, descripcion } = req.body;

    try {
        // Verificar si la clave ya existe
        const claveExistente = await Categoria.findOne({ clave });
        if (claveExistente) {
            return res.status(400).json({ message: 'La clave ya está en uso' });
        }

        const categoria = new Categoria({
            clave,
            nombre,
            descripcion
        });

        const nuevaCategoria = await categoria.save();
        res.status(201).json(nuevaCategoria);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT: Actualizar una categoría existente
exports.updateCategoria = async (req, res) => {
    const { clave, nombre, descripcion } = req.body;

    try {
        const categoria = await Categoria.findById(req.params.id);
        if (!categoria) return res.status(404).json({ message: 'Categoría no encontrada' });

        // Verificar si la nueva clave ya está en uso por otra categoría
        if (clave && clave !== categoria.clave) {
            const claveExistente = await Categoria.findOne({ clave });
            if (claveExistente) {
                return res.status(400).json({ message: 'La clave ya está en uso' });
            }
        }

        // Actualizar los campos de la categoría
        categoria.clave = clave || categoria.clave;
        categoria.nombre = nombre || categoria.nombre;
        categoria.descripcion = descripcion || categoria.descripcion;

        const categoriaActualizada = await categoria.save();
        res.status(200).json(categoriaActualizada);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE: Eliminar una categoría
exports.deleteCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.findById(req.params.id);
        if (!categoria) return res.status(404).json({ message: 'Categoría no encontrada' });

        await categoria.remove();
        res.status(200).json({ message: 'Categoría eliminada correctamente' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
