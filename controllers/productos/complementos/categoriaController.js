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

    const categoria = new Categoria({
        clave,
        nombre,
        descripcion
    });

    try {
        const nuevaCategoria = await categoria.save();
        res.status(201).json(nuevaCategoria);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT: Actualizar una categoría existente
exports.updateCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.findById(req.params.id);
        if (!categoria) return res.status(404).json({ message: 'Categoría no encontrada' });

        categoria.clave = req.body.clave || categoria.clave;
        categoria.nombre = req.body.nombre || categoria.nombre;
        categoria.descripcion = req.body.descripcion || categoria.descripcion;

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
