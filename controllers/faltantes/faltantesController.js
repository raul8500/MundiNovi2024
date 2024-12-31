const Product = require('../../schemas/productosSchema/productosSchema'); // Modelo de Productos
const Kardex = require('../../schemas/kardexSchema/kardexSchema'); // Modelo de Kardex
const Stock = require('../../schemas/stocksSchema/stocksSchema'); // Modelo de Stock

// Generar reporte de faltantes
exports.generarReporteFaltantes = async (req, res) => {
    try {
        const { sucursalOrigen, sucursalDestino } = req.params;

        if (!sucursalOrigen || !sucursalDestino) {
            return res.status(400).json({ error: 'Sucursal Origen y Sucursal Destino son requeridas.' });
        }

        /** 1. Recuperar productos con referencia, nombre y unidad */
        const productos = await Product.find({}, 'reference name presentacion').lean();

        if (!productos.length) {
            return res.status(404).json({ error: 'No se encontraron productos.' });
        }

        /** 2. Mapear referencias y buscar existencias para cada producto */
        const reporte = await Promise.all(productos.map(async (producto) => {
            // Obtener la existencia más reciente para Origen
            const existenciaOrigen = await Kardex.findOne(
                { reference: producto.reference, sucursal: sucursalOrigen },
                'existencia'
            ).sort({ fecha: -1 }).lean();

            // Obtener la existencia más reciente para Destino
            const existenciaDestino = await Kardex.findOne(
                { reference: producto.reference, sucursal: sucursalDestino },
                'existencia'
            ).sort({ fecha: -1 }).lean();

            // Obtener stock para la referencia en la sucursal destino
            const stockData = await Stock.findOne(
                { sucursalId: sucursalDestino, 'productos.reference': producto.reference },
                { 'productos.$': 1 } // Proyección para obtener solo el producto específico
            ).lean();

            const stockMinimo = stockData?.productos?.[0]?.stockMinimo || 0;
            const stockMaximo = stockData?.productos?.[0]?.stockMaximo || 0;

            return {
                clave: producto.reference,
                nombre: producto.name,
                presentacion: producto.presentacion || "N/A",
                existenciaOrigen: existenciaOrigen?.existencia || 0,
                existenciaDestino: existenciaDestino?.existencia || 0,
                stockMinimo,
                stockMaximo
            };
        }));

        return res.status(200).json({
            mensaje: 'Reporte de faltantes generado correctamente.',
            data: reporte
        });

    } catch (error) {
        console.error('Error al generar el reporte de faltantes:', error);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
};
