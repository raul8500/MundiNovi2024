// models/Ingreso.js
const mongoose = require('mongoose');

const ingresoSchema = new mongoose.Schema(
  {
    sucursal: { type: mongoose.Schema.Types.ObjectId, ref: 'sucursal', required: true }, // Referencia a Sucursal
    folio: { type: String, required: true, unique: true }, // Folio único
    tipoIngreso: { type: mongoose.Schema.Types.ObjectId, ref: 'TipoIngreso', required: true }, // Referencia a Tipo de Ingreso
    importe: { type: Number, required: true }, // Monto del ingreso
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }, // Referencia a Usuario
    fecha: { type: Date, required: true, default: Date.now }, // Fecha del ingreso
    observaciones: { type: String, required: false }, // Observaciones opcionales
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ingreso', ingresoSchema);
