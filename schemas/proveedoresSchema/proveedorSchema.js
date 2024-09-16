const mongoose = require('mongoose');

const proveedorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  informacionContacto: {
    telefono: {
      type: String,
      required: true,
      trim: true
    },
    correo: {
      type: String,
      required: true,
      trim: true
    },
  },
  direccion: {
    calle: {
      type: String,
      required: true
    },
    ciudad: {
      type: String,
      required: true
    },
    estado: {
      type: String,
      required: true
    },
    codigoPostal: {
      type: String,
      required: true
    },
    pais: {
      type: String,
      required: true
    }
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo'
  }
});

const Proveedor = mongoose.model('Proveedor', proveedorSchema);

module.exports = Proveedor;
