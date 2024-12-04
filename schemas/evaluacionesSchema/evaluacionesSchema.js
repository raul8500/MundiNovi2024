const mongoose = require('mongoose');

const evaluacionSchema = new mongoose.Schema({
    sucursalId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'sucursal'
    },
    evaluadorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    fechaHora: {
        type: Date,
        default: Date.now
    },
    calificaciones: [
        {
            titulo: { type: String, required: true }, // Título del parámetro evaluado
            calificacion: { type: Number, default: 0 } // Calificación del parámetro
        }
    ]
});

module.exports = mongoose.model('Evaluacion', evaluacionSchema);
