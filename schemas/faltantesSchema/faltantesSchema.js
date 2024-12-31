const mongoose = require('mongoose');

const ReporteFaltantesSchema = new mongoose.Schema({
    clave: { type: String, required: true }, 
    nombre: { type: String, required: true },
    presentacion: { type: String, required: true },
    existenciaOrigen: { type: Number, required: true },
    existenciaDestino: { type: Number, required: true },
    stockMinimo: { type: Number, required: true },
    stockMaximo: { type: Number, required: true }
});

module.exports = mongoose.model('ReporteFaltantes', ReporteFaltantesSchema);
