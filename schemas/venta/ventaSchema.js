const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
    sucursal: {
        type: String, // Cambiado de ObjectId a String
        required: true
    },
    productos: [{
        id: { type: String, required: true }, // Cambiado de ObjectId a String
        nombre: { type: String, required: true },
        cantidad: { type: Number, required: true },
        importe: { type: Number, required: true }
    }],
    total: { type: Number, required: true },
    fecha: { type: Date, required: true }
});

module.exports = mongoose.model('Venta', ventaSchema);
