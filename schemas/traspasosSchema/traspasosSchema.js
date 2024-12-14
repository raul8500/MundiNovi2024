const mongoose = require('mongoose');

const TraspasoSchema = new mongoose.Schema({
    folio: { type: Number, unique: true, required: true },
    productos: [
        {
            producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
            cantidad: { type: Number, required: true }
        }
    ],
    sucursalOrigen: { type: mongoose.Schema.Types.ObjectId, ref: 'Sucursal', required: true },
    sucursalDestino: { type: mongoose.Schema.Types.ObjectId, ref: 'Sucursal', required: true },
    fechaCreacion: { type: Date, default: Date.now },
    fechaEntrega: { type: Date },
    estado: { type: String, enum: ['pendiente', 'entregado'], default: 'pendiente' }
});

module.exports = mongoose.model('Traspaso', TraspasoSchema);
