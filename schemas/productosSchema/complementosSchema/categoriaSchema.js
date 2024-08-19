const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
    clave: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    descripcion: { type: String }
});

const Categoria = mongoose.model('Categoria', categoriaSchema);
module.exports = Categoria;
