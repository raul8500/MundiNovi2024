const mongoose = require('mongoose');

const capacitacionSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ['examen', 'documento', 'pagina', 'video'],
    required: true,
  },
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  descripcion: {
    type: String,
    trim: true,
  },
  archivo: {
    type: String,
    required: function () {
      return ['examen', 'documento'].includes(this.tipo);
    },
  },
  link: {
    type: String,
    required: function () {
      return ['pagina', 'video'].includes(this.tipo);
    },
    validate: {
      validator: function (v) {
        return /^(https?:\/\/[^\s]+)/.test(v); // Valida que sea un link válido
      },
      message: 'Debe ser un URL válido.',
    },
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Capacitacion', capacitacionSchema);
