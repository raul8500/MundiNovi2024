const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
    noVenta: { type: String, required: true },
    vendedor: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    sucursal: { type: mongoose.Schema.Types.ObjectId, ref: 'sucursal', required: true },
    tipoVenta: { type: String, required: true },
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: false, default: null},
    totalVenta: { type: Number, required: true },
    totalProductos: { type: Number, required: true },
    productos: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            nombre: { type: String, required: true },
            reference: { type: String, required: true },
            precioSinIva: { type: Number, required: true },
            precioConIva: { type: Number, required: true },
            precio1: { type: Number, required: true },
            cantidad: { type: Number, required: true },
            kardexId: { type: mongoose.Schema.Types.ObjectId, ref: 'Kardex', required: true },
            kardexFolio: { type: String, required: true }
        }
    ],
    pagos:{
        formasDePago: [
            {
                forma: { type: String, required: true },
                importe: { type: Number, required: true }
            }
        ],
        cambio : {type: Number, required: false, default : 0 }
    },
    factura: 
        {
            codigoFacturacion: { type: String, required: false },
            estado: { type: Number, required: false, default: 0},
            idAlegraFacura: { type: String, required: false },
            pdfUrl: { type: String, required: false },
            xmlUrl: { type: String, required: false },
        },
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ventas', ventaSchema);
