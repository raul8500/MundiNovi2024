// models/TipoIngreso.js
const mongoose = require('mongoose');

const tipoIngresoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  descripcion: {
    type: String,
    required: false,
    trim: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('TipoIngreso', tipoIngresoSchema);
