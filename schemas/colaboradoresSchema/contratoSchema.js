const mongoose = require('mongoose');

const contratoSchema = new mongoose.Schema({
    contenido: {
        type: String,
        required: true
    },
    ultimaActualizacion: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Contrato', contratoSchema);
