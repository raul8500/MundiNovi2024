const mongoose = require('mongoose');


const respuestaSchema = new mongoose.Schema({
  examenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Examen', required: true },
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  respuestas: [
    {
      pregunta: { type: String, required: true },
      respuesta: { type: Number, required: true }, // Índice de la respuesta seleccionada
      correcta: { type: Boolean, required: true }
    }
  ],
  calificacion: { type: Number, required: true },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Respuesta', respuestaSchema);
