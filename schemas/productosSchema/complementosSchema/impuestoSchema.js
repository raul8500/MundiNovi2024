const mongoose = require('mongoose');

const impuestoSchema = new mongoose.Schema({
    clave: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    descripcion: { type: String }
});

const Impuesto = mongoose.model('Impuesto', impuestoSchema);
module.exports = Impuesto;
