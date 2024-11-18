const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
    noVenta: { type: String, required: true },
    sucursal: { type: mongoose.Schema.Types.ObjectId, ref: 'sucursal', required: true },
    tipoVenta: { type: String, required: true },
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', default: null },
    totalVenta: { type: Number, required: true },
    totalProductos: { type: Number, required: true },
    productos: [
        {
            nombre: { type: String, required: true },
            productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            cantidad: { type: Number, required: true },
            precio: { type: Number, required: true },
            kardexId: { type: mongoose.Schema.Types.ObjectId, ref: 'Kardex', required: true }, // Mantener el ObjectId de Kardex
            kardexFolio: { type: String, required: true } // Nuevo campo para guardar el folio
        }
    ],
    formasDePago: [
        {
            tipo: { type: String, required: true },
            cambio : {type: Number, required: false, default : 0 },
            importe: { type: Number, required: true }
        }
    ],
    factura: 
        {
            estado: { type: String, required: false, default : 'sin factura' },
            idAlegraFacura: { type: String, required: false },
            pdfUrl: { type: String, required: false },
            xmlUrl: { type: String, required: false },
        }
        ,
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ventas', ventaSchema);
