const Venta = require('../../schemas/venta/ventaSchema');

exports.getVentasDelDia = async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const finDia = new Date();
    finDia.setHours(23, 59, 59, 999);

    const ventas = await Venta.find({
      fecha: { $gte: hoy, $lte: finDia }
    })
    /*
    .populate('cliente', 'nombre')         // si tienes relación con cliente
    .populate('sucursal', 'nombre')        // si tienes relación con sucursal
    .lean();
    */
    res.status(200).json({
      message: 'Ventas del día obtenidas correctamente',
      ventas
    });
  } catch (error) {
    console.error('Error al obtener ventas del día:', error);
    res.status(500).json({ error: 'Error al obtener ventas del día' });
  }
};
