const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
    folio: { type: Number, unique: true, required: true },
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
    productos: [
        {
            producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
            cantidad: { type: Number, required: true },
            estado: { type: String, enum: ['pendiente', 'parcial', 'entregado'], default: 'pendiente' }
        }
    ],
    sucursalOrigen: { type: mongoose.Schema.Types.ObjectId, ref: 'Sucursal', required: true },
    fechaCreacion: { type: Date, default: Date.now },
    fechaEntrega: { type: Date },
    estado: { type: String, enum: ['pendiente', 'en proceso', 'entregado'], default: 'pendiente' }
});

module.exports = mongoose.model('Pedido', PedidoSchema);
