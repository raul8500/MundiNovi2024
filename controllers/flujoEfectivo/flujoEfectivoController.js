const FlujoEfectivo = require('../../schemas/flujoEfectivoSchema/flujoEfectivoSchema');
const Sucursal = require('../../schemas/sucursalSchema/sucursalSchema');

exports.getAllFlujos = async (req, res) => {
    try {
        const { idTienda, fechaInicio, fechaFin } = req.query;

        if (!idTienda || !fechaInicio || !fechaFin) {
            return res.status(400).json({ error: 'Faltan parámetros: idTienda, fechaInicio o fechaFin.' });
        }

        const fechaIni = new Date(fechaInicio);
        const fechaFinReal = new Date(fechaFin);
        fechaFinReal.setHours(23, 59, 59, 999); // Incluir todo el día

        // Buscar sucursales asociadas a la tienda
        const sucursales = await Sucursal.find({ idFranquicia: idTienda }).select('_id');

        const sucursalIds = sucursales.map(s => s._id);

        // Buscar flujos de esas sucursales en el rango de fechas
        const flujos = await FlujoEfectivo.find({
            sucursal: { $in: sucursalIds },
            fecha: { $gte: fechaIni, $lte: fechaFinReal }
        }).populate('sucursal', 'nombre').sort({ fecha: -1 });

        res.status(200).json({
            message: 'Flujos encontrados',
            flujos
        });
    } catch (error) {
        console.error('Error al obtener flujos filtrados:', error);
        res.status(500).json({ error: 'Error al obtener flujos' });
    }
};
