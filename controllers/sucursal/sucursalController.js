const Sucursal = require('../../schemas/sucursalSchema/sucursalSchema'); // Asegúrate de poner la ruta correcta a tu modelo

// Crear una nueva sucursal
exports.addSucursal = async (req, res) => {
    try {
        const body = req.body;
        const nuevaSucursal = await Sucursal.create(body);
        res.status(201).send(nuevaSucursal);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
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


