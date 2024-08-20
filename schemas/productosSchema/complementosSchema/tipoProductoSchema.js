const mongoose = require('mongoose');

const tipoProductoSchema = new mongoose.Schema({
    clave: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    descripcion: { type: String }
});

const TipoProducto = mongoose.model('TipoProducto', tipoProductoSchema);
module.exports = TipoProducto;
