const mongoose = require('mongoose');

const ProductoSchemaCobro = new mongoose.Schema({
  clave: String,
  nombre: String,
  precio1: Number,
  precio2: Number,
  precio3: Number,
  precio4: Number,
  precio5: Number,
  precio6: Number,
  precio7: Number,
  precio8: Number,
  precio9: Number,
  precio10: Number,
});

module.exports = mongoose.model('ProductoCobro', ProductoSchemaCobro);
