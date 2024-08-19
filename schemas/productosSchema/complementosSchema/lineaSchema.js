const mongoose = require('mongoose');

const lineaSchema = new mongoose.Schema({
    clave: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    descripcion: { type: String }
});

const Linea = mongoose.model('Linea', lineaSchema);
module.exports = Linea;
