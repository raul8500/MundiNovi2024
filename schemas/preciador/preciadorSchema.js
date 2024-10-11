const mongoose = require('mongoose');

const preciadorSchema = new mongoose.Schema({
    productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Referencia al producto
    sucursalesPendientes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sucursal' }] // IDs de sucursales que no han impreso el nuevo precio
}, { timestamps: true });

module.exports = mongoose.model('Preciador', preciadorSchema);
