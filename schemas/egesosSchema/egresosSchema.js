const mongoose = require('mongoose');

const egresoSchema = new mongoose.Schema(
    {
        folioEgreso: {
            type: Number,
            required: true,
            unique: true, // Garantiza que no se repita el folio
        },
        importe: {
            type: Number,
            required: true,
            min: 0, // Asegura que el importe no sea negativo
        },
        observaciones: {
            type: String,
            required: false,
            trim: true, // Elimina espacios en blanco adicionales
        },
        archivoComprobatorio: {
            type: String, // Guardará la ruta o URL del archivo
            required: false,
        },
        sucursal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'sucursal',
            required: true,
        },
        fechaHora: {
            type: Date,
            default: Date.now, // Registra automáticamente la fecha y hora de creación
        },
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },
        folioPadre: {
            type: Number,
            required: false, // Opcional para cuando haya un folio asociado
        },
    },
    { timestamps: true } // Agrega `createdAt` y `updatedAt` automáticamente
);

module.exports = mongoose.model('Egreso', egresoSchema);
