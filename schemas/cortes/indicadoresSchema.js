const mongoose = require('mongoose');

// Esquema de indicadores para cada sucursal
const indicadores = new mongoose.Schema({
    sucursalId: {
        type: mongoose.Schema.Types.ObjectId, // Relacionar con la colección de Sucursales
        ref: 'sucursal', // Nombre del modelo de sucursal
        required: true
    },
    verde: { // Cantidad para el indicador verde
        type: Number,
        required: true,
        default: 0
    },
    naranja: { // Cantidad para el indicador naranja
        type: Number,
        required: true,
        default: 0
    },
    rojo: { // Cantidad para el indicador rojo
        type: Number,
        required: true,
        default: 0
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Indicadores', indicadores);
