const mongoose = require('mongoose');

const tipoActaSchema = new mongoose.Schema({
    tipo: { type: String, unique: true, required: true },
    mensaje: { type: String, required: true },
});

module.exports = mongoose.model('TipoActa', tipoActaSchema);
