const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
    noVenta: { type: String, required: true },
    sucursal: { type: mongoose.Schema.Types.ObjectId, ref: 'sucursal', required: true },
    tipoVenta: { type: String, required: true },
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'client', default: null },
    totalVenta: { type: Number, required: true },
    totalProductos: { type: Number, required: true },
    productos: [
        {
            productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
            cantidad: { type: Number, required: true },
            precio: { type: Number, required: true },
            kardexId: { type: mongoose.Schema.Types.ObjectId, ref: 'Kardex', required: true }, // Mantener el ObjectId de Kardex
            kardexFolio: { type: String, required: true } // Nuevo campo para guardar el folio
        }
    ],
    formasDePago: [
        {
            tipo: { type: String, required: true },
            importe: { type: Number, required: true }
        }
    ],
    fecha: { type: Date, default: Date.now }
});




module.exports = mongoose.model('ventas', ventaSchema);




module.exports = mongoose.model('ventas', ventaSchema);
