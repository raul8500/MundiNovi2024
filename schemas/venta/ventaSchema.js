const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
    sucursal: { type: mongoose.Schema.Types.ObjectId, ref: 'sucursal', required: true },
    fecha: { type: Date, default: Date.now },
    direccion: { type: String, required: true },
    productos: [{
        nombre: { type: String, required: true },
        cantidad: { type: Number, required: true },
        precio: { type: Number, required: true },
        total: { type: Number, required: true }
    }],
    totalVenta: { type: Number, required: true },
    totalProductos: { type: Number, required: true }
});

module.exports = mongoose.model('ventasTest', ventaSchema);
