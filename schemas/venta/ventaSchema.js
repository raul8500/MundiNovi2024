const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
    noVenta : {type: String},
    sucursal: { type: mongoose.Schema.Types.ObjectId, ref: 'sucursal'},
    tipoVenta: {type: Boolean},
    cliente : { type: mongoose.Schema.Types.ObjectId, ref: 'client' },
    totalVenta: { type: Number, required: true },
    totalProductos: { type: Number, required: true },
    fecha: { type: Date, default: Date.now },
    productos: [{
        _id : { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
        nombre: { type: String, required: true },
        cantidad: { type: Number, required: true },
        precio: { type: Number, required: true },
        total: { type: Number, required: true },
        noKardexAsociado : { type: mongoose.Schema.Types.ObjectId, ref: 'kardex' },
    }]
});

module.exports = mongoose.model('ventas', ventaSchema);
