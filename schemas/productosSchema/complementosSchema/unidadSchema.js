const mongoose = require('mongoose');

const unidadSchema = new mongoose.Schema({
    clave: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    descripcion: { type: String }
});

const Unidad = mongoose.model('Unidad', unidadSchema);
module.exports = Unidad;
