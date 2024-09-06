const mongoose = require('mongoose');

const kardexSchema = new mongoose.Schema({
    fecha: {
        type: Date,
        required: true
    },
    folio: {
        type: String,
        required: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Referencia al modelo Usuario
        required: true
    },
    movimiento: {
        type: String,
        required: true
    },
    sucursal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sucursal',
        required: true // Campo obligatorio
    },
    sucursalDestino: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sucursal',
        required: false
    },
    reference: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    existencia: {
        type: Number,
        required: true
    },
    costoUnitario: {
        type: Number,
        required: true
    }
}, {
    timestamps: true 
});

const Kardex = mongoose.model('Kardex', kardexSchema);

module.exports = Kardex;

