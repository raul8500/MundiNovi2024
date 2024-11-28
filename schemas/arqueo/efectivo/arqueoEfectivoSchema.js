const mongoose = require('mongoose');

const arqueoSchema = new mongoose.Schema({
    sucursal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sucursal', // Referencia al esquema de sucursales
        required: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Referencia al esquema de usuarios
        required: true
    },
    fechaHora: {
        type: Date,
        default: Date.now, // Fecha y hora en que se realiza el arqueo
        required: true
    },
    totalVentasEfectivo: {
        type: Number,
        required: true,
        default: 0, // Monto calculado a partir de las ventas en efectivo
        min: 0
    },
    efectivoEnCaja: {
        type: Number,
        required: true,
        default: 0, // Monto físico contado en la caja
        min: 0
    },
    diferencia: {
        type: Number,
        required: true,
        default: 0 // Diferencia entre efectivo esperado y contado
    },
}, {
    timestamps: true // Incluye `createdAt` y `updatedAt`
});

module.exports = mongoose.model('ArqueoEfectivo', arqueoSchema);
