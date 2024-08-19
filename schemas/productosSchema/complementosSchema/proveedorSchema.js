const mongoose = require('mongoose');

const proveedorSchema = new mongoose.Schema({
    clave: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    descripcion: { type: String }
});

const Proveedor = mongoose.model('Proveedor', proveedorSchema);
module.exports = Proveedor;
