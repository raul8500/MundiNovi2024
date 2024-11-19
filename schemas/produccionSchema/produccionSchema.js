const mongoose = require('mongoose');

const ProduccionSchema = new mongoose.Schema({
    fechaHora: {
        type: Date,
        default: Date.now, // Fecha y hora actuales por defecto
    },
    nombreProducto: {
        type: String,
        trim: true, // Elimina espacios en blanco adicionales
    },
    cantidad: {
        type: Number,
        min: [0, 'La cantidad no puede ser negativa'], // Validación de cantidad no negativa
    },
    folio: {
        type: String,
        unique: true, // El folio debe ser único
        trim: true,
    },
    numeroLote: {
        type: String,
        trim: true, // Elimina espacios en blanco adicionales
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Referencia al modelo User
    },
    materiasPrimas: [
        {
            clave: {
                type: String,
                trim: true,
            },
            nombre: {
                type: String,
                trim: true,
            },
            cantidad: {
                type: Number,
                min: [0, 'La cantidad no puede ser negativa'], // Validación de cantidad no negativa
            },
            folio: {
                type: String,
                trim: true,
            },
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model('Produccion', ProduccionSchema);
