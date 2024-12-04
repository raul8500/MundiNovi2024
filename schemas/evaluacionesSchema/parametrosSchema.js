const mongoose = require('mongoose');

const parametroSchema = new mongoose.Schema({
    nombre: { type: String, required: true }, // Nombre del parámetro
    descripcion: { type: String }, // Descripción opcional del parámetro
    activo: { type: Boolean, default: true } // Para desactivar parámetros sin eliminarlos
});

module.exports = mongoose.model('Parametro', parametroSchema);
