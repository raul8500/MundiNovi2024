const Venta = require('../../schemas/venta/ventaSchema');

exports.createVenta = async (req, res) => {
    try {
        const { sucursalId, fecha, direccion, productos, totalVenta, totalProductos } = req.body;

        const nuevaVenta = new Venta({
            sucursal: sucursalId,
            fecha,
            direccion,
            productos,
            totalVenta,
            totalProductos
        });

        await nuevaVenta.save();

        res.status(201).json({ message: 'Venta guardada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar la venta' });
    }
};
