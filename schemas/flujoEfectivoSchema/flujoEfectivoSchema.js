
const mongoose = require('mongoose');

const flujoEfectivoSchema = new mongoose.Schema({
  sucursal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'sucursal',
    required: true,
  },
  fecha: {
    type: Date,
    required: true,
  },
  efectivoInicial: {
    type: Number,
    required: true,
    default: 0,
  },
  ingresosEfectivo: {
    type: Number,
    required: true,
    default: 0,
  },
  ingresosBanco: {
    type: Number,
    required: true,
    default: 0,
  },
  egresosEfectivo: {
    type: Number,
    required: true,
    default: 0,
  },
  egresosBanco: {
    type: Number,
    required: true,
    default: 0,
  },
  efectivoFinal: {
    type: Number,
    required: true,
    default: 0,
  },
  tipo: {
    type: String,
    default: 'Corte Final',
  },
  observaciones: {
    type: String,
    default: '',
  }
}, {
  timestamps: true
});

// Para orden cronológico o auditoría
flujoEfectivoSchema.index({ sucursal: 1, fecha: 1, createdAt: 1 });

module.exports = mongoose.model('FlujoEfectivo', flujoEfectivoSchema);
