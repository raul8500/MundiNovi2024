const mongoose = require('mongoose');

const ProductoSchemaCobro = new mongoose.Schema({
  clave: String,
  claveProveedor: String,
  codigoBarra: String,
  nombre: String,
  descripcion: String,
  tiempoSurtido: Number,
  controlAlmacen: Boolean,
  volumen: Number,
  peso: Number,
  costo: Number,
  ultimoCosto: Number,
  costoPromedio: Number,
  unidadEntrada: String,
  unidadSalida: String,
  factorEntreUnidades: Number,
  unidadEmpaque: String,
  lote: String,
  precio1: Number,
  porcentajePrecio1: Number,
  rangoInicial1: Number,
  rangoFinal1: Number,
  precio2: Number,
  porcentajePrecio2: Number,
  rangoInicial2: Number,
  rangoFinal2: Number,
  precio3: Number,
  porcentajePrecio3: Number,
  rangoInicial3: Number,
  rangoFinal3: Number,
  precio4: Number,
  porcentajePrecio4: Number,
  rangoInicial4: Number,
  rangoFinal4: Number,
  precio5: Number,
  porcentajePrecio5: Number,
  rangoInicial5: Number,
  rangoFinal5: Number,
  precio6: Number,
  porcentajePrecio6: Number,
  rangoInicial6: Number,
  rangoFinal6: Number,
  precio7: Number,
  porcentajePrecio7: Number,
  rangoInicial7: Number,
  rangoFinal7: Number,
  precio8: Number,
  porcentajePrecio8: Number,
  rangoInicial8: Number,
  rangoFinal8: Number,
  precio9: Number,
  porcentajePrecio9: Number,
  rangoInicial9: Number,
  rangoFinal9: Number,
  precio10: Number,
  porcentajePrecio10: Number,
  rangoInicial10: Number,
  rangoFinal10: Number,
  observaciones: String,
  linea: { type: mongoose.Schema.Types.ObjectId, ref: 'Linea' },
  departamento: { type: mongoose.Schema.Types.ObjectId, ref: 'Departamento' },
  marca: { type: mongoose.Schema.Types.ObjectId, ref: 'Marca' },
  impuesto: { type: mongoose.Schema.Types.ObjectId, ref: 'Impuesto' },
  esKit: { type: Boolean, default: false }, // Mantiene booleano para indicar si es kit
  esGrupo: { type: Boolean, default: false }, // Mantiene booleano para indicar si es grupo
  grupoProductos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductoCobro', default: null }], // Array de productos si es un grupo
  kitProductos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductoCobro', default: null }], // Array de productos si es un kit
  esVisible: Boolean,
  presentacionProducto: String,
  esActivo: { type: Boolean, default: true },
  alegra: { type: Boolean, default: true },
  productKey: { type: String, default: true },
  id: { type: String, default: true }
});

module.exports = mongoose.model('ProductoCobro', ProductoSchemaCobro);
