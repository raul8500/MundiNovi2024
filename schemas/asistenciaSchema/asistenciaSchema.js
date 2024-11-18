const mongoose = require('mongoose');

const asistenciaSchema = new mongoose.Schema({
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    fecha: { type: String, required: true }, // Formato YYYY-MM-DD
    acciones: {
        entrada: { type: Date },
        salidaComer: { type: Date },
        regresoComer: { type: Date },
        terminoJornada: { type: Date }
    }
});

module.exports = mongoose.model('Asistencia', asistenciaSchema);
