const Proveedor = require('../../schemas/proveedoresSchema/proveedorSchema');

// Crear un nuevo proveedor
exports.addProveedor = async (req, res) => {
    try {
        const body = req.body;
        const nuevoProveedor = await Proveedor.create(body);
        res.status(201).send(nuevoProveedor);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Obtener todos los proveedores
exports.getProveedores = async (req, res) => {
    try {
        const proveedores = await Proveedor.find();
        res.status(200).send(proveedores);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Obtener un proveedor por ID
exports.getProveedorById = async (req, res) => {
    try {
        const proveedorId = req.params.id;
        const proveedor = await Proveedor.findById(proveedorId);
        if (!proveedor) {
            return res.status(404).send('Proveedor no encontrado');
        }
        res.status(200).send(proveedor);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Actualizar un proveedor por ID
exports.updateProveedor = async (req, res) => {
    try {
        const proveedorId = req.params.id;
        const body = req.body;
        const proveedorActualizado = await Proveedor.findByIdAndUpdate(proveedorId, body, { new: true });
        if (!proveedorActualizado) {
            return res.status(404).send('Proveedor no encontrado');
        }
        res.status(200).send(proveedorActualizado);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Eliminar un proveedor por ID
exports.deleteProveedor = async (req, res) => {
    try {
        const proveedorId = req.params.id;
        const proveedorEliminado = await Proveedor.findByIdAndDelete(proveedorId);
        if (!proveedorEliminado) {
            return res.status(404).send('Proveedor no encontrado');
        }
        res.status(200).send('Proveedor eliminado correctamente');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};
