const Producto = require('../../schemas/productosSchema/productosSchema');

// Obtener todos los productos
exports.getAll = async (req, res) => {
    try {
        // Obtén todos los productos
        const productos = await Producto.find();

        // Para cada producto, obtener detalles de productos adicionales
        const productosConDetalles = await Promise.all(productos.map(async (producto) => {
            // Obtener productos adicionales
            const productosAdicionales = await Producto.find({ '_id': { $in: producto.productosAdicionales } });

            // Devolver producto con detalles adicionales
            return {
                ...producto.toObject(),
                productosAdicionales,
            };
        }));

        res.status(200).json(productosConDetalles);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

// Obtener un producto por ID
exports.getById = async (req, res) => {
    try {
        // Obtén el producto por ID
        const producto = await Producto.findById(req.params.id);

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Obtener productos adicionales
        const productosAdicionales = await Producto.find({ '_id': { $in: producto.productosAdicionales } });

        // Devolver producto con detalles adicionales
        res.status(200).json({
            ...producto.toObject(),
            productosAdicionales,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

// Crear un nuevo producto
exports.create = async (req, res) => {
    try {
        const { clave } = req.body;

        // Verificar si ya existe un producto con la misma clave
        const existingProducto = await Producto.findOne({ clave });

        if (existingProducto) {
            return res.status(400).json({ error: 'Ya existe un producto con esta clave' });
        }

        const producto = new Producto(req.body);
        await producto.save();
        res.status(201).json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
};

// Actualizar un producto por ID
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { clave } = req.body;

        // Verificar si ya existe un producto con la misma clave y no es el producto que se está actualizando
        const existingProducto = await Producto.findOne({ clave, _id: { $ne: id } });

        if (existingProducto) {
            return res.status(400).json({ error: 'Ya existe un producto con esta clave' });
        }

        const producto = await Producto.findByIdAndUpdate(id, req.body, { new: true });
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

// Eliminar un producto por ID
exports.deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findByIdAndDelete(id);
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

        res.status(200).json({ message: 'Producto eliminado correctamente', producto });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};
