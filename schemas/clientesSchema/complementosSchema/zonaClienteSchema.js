const mongoose = require('mongoose');

const zonaClienteSchema = new mongoose.Schema({
    clave: {
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String
    }
});

module.exports = mongoose.model('ZonaCliente', zonaClienteSchema);
