const mongoose = require('mongoose');

const preguntaSchema = new mongoose.Schema({
  pregunta: { type: String, required: true },
  opciones: { type: [String], required: true },
  respuestaCorrecta: { type: Number, required: true }
});

const examenSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String },
  preguntas: [preguntaSchema],
  creador: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  activo: { type: Boolean, default: false }, // Campo para activar/desactivar el examen
  tiposPermitidos: { type: [Number], required: true }, // Tipos de usuarios permitidos
  fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Examen', examenSchema);
