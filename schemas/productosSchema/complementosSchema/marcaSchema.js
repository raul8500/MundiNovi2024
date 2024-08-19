const mongoose = require('mongoose');

const marcaSchema = new mongoose.Schema({
    clave: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    descripcion: { type: String }
});

const Marca = mongoose.model('Marca', marcaSchema);
module.exports = Marca;
