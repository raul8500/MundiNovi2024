const Sucursal = require('../../schemas/sucursalSchema/sucursalSchema'); // Asegúrate de poner la ruta correcta a tu modelo

// Crear una nueva sucursal
exports.addSucursal = async (req, res) => {
    try {
        const body = req.body;
        const { clave } = body;

        // Verificar si la clave ya existe
        const sucursalExistente = await Sucursal.findOne({ clave });
        if (sucursalExistente) {
            return res.status(409).json({ error: 'La clave de sucursal ya existe' }); // Código de estado 409 Conflict
        }

        // Crear nueva sucursal si la clave no existe
        const nuevaSucursal = await Sucursal.create(body);
        res.status(201).send(nuevaSucursal);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Obtener sucursal por _id
exports.getSucursalById = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que el id esté presente
        if (!id) {
            return res.status(400).send('El ID es requerido'); // Código de estado 400 Bad Request
        }

        // Buscar la sucursal por _id
        const sucursal = await Sucursal.findById(id).populate('idFranquicia');

        // Verificar si la sucursal fue encontrada
        if (!sucursal) {
            return res.status(404).send('Sucursal no encontrada'); // Código de estado 404 Not Found
        }

        res.status(200).send(sucursal); // Código de estado 200 OK
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error interno del servidor'); // Código de estado 500 Internal Server Error
    }
};

// Obtener una sucursal por clave
exports.getSucursalByClave = async (req, res) => {
    try {
        const { clave } = req.params;
        const sucursal = await Sucursal.findOne({ clave: clave }).populate('idFranquicia');

        if (!sucursal) {
            return res.status(404).send('Sucursal no encontrada');
        }

        res.send(sucursal);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Obtener todas las sucursales
exports.getAllSucursales = async (req, res) => {
    try {
        const sucursales = await Sucursal.find().populate('idFranquicia');
        res.send(sucursales);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Obtener sucursales por ID de franquicia
exports.getSucursalesByFranquicia = async (req, res) => {
    try {
        const { idFranquicia } = req.params;
        const sucursales = await Sucursal.find({ idFranquicia: idFranquicia }).populate('idFranquicia');

        if (sucursales.length === 0) {
            return res.status(404).send('No se encontraron sucursales para esta franquicia');
        }

        res.send(sucursales);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Actualizar una sucursal por clave
exports.updateSucursalByClave = async (req, res) => {
    try {
        const { clave } = req.params;
        const updatedSucursal = await Sucursal.findOneAndUpdate({ clave: clave }, req.body, { new: true }).populate('idFranquicia');

        if (!updatedSucursal) {
            return res.status(404).send('Sucursal no encontrada');
        }

        res.send(updatedSucursal);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Actualizar una sucursal por _id
exports.updateSucursalById = async (req, res) => {
    try {
        const { id } = req.params;
        const { clave } = req.body;

        // Verificar si la clave ya existe en otra sucursal
        const existingSucursal = await Sucursal.findOne({ clave, _id: { $ne: id } });

        if (existingSucursal) {
            return res.status(409).json({ message: 'La clave ya existe en otra sucursal.' });
        }

        // Actualizar la sucursal si la clave no existe
        const updatedSucursal = await Sucursal.findByIdAndUpdate(id, req.body, { new: true }).populate('idFranquicia');

        if (!updatedSucursal) {
            return res.status(404).send('Sucursal no encontrada');
        }

        res.send(updatedSucursal);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Eliminar una sucursal por clave
exports.deleteSucursalByClave = async (req, res) => {
    try {
        const { clave } = req.params;
        const deletedSucursal = await Sucursal.findOneAndDelete({ clave: clave });

        if (!deletedSucursal) {
            return res.status(404).send('Sucursal no encontrada');
        }

        res.send('Sucursal eliminada correctamente');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Eliminar una sucursal por _id
exports.deleteSucursalById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSucursal = await Sucursal.findByIdAndDelete(id);

        if (!deletedSucursal) {
            return res.status(404).send('Sucursal no encontrada');
        }

        res.send('Sucursal eliminada correctamente');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};


