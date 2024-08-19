const mongoose = require('mongoose');

const departamentoSchema = new mongoose.Schema({
    clave: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    descripcion: { type: String }
});

const Departamento = mongoose.model('Departamento', departamentoSchema);
module.exports = Departamento;
