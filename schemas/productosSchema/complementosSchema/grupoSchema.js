const mongoose = require('mongoose');

const grupoSchema = new mongoose.Schema({
    clave: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    descripcion: { type: String }
});

const Grupo = mongoose.model('Grupo', grupoSchema);
module.exports = Grupo;
