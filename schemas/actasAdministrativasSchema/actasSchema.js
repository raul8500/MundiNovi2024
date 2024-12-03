const mongoose = require('mongoose');

const actaSchema = new mongoose.Schema({
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    tipo: { type: String, required: true },
    mensaje: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Acta', actaSchema);
