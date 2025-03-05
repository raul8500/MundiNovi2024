const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

  idAlegra: {
    type: String, required: false
  },
  type: {
    type: String, required: false,
  },
  reference: {
    type: String, required: false,
  },
  esActivo: {
    type: Boolean, required: false,
  },
  codigoBarra: {
    type: String, required: false, 
  },
  name: {
    type: String, required: false, 
  },
  productKey: {
    type: String, required: false, 
  },
  description: {
    type: String, required: false, 
  },
  inventory: {
    unit: {
      type: String,
      required: false, 
    },
  },
  tiempoSurtido: {
    type: Number, required: false, 
  },
  volumen: {
    type: Number, required: false, 
  },
  peso: {
    type: Number, required: false, 
  },
  presentacion: {
    type: Number, required: false, 
  },
  datosFinancieros: {
    costo: { type: Number, required: false }, 
    ultimoCosto: { type: Number, required: false }, 
    costoPromedio: { type: Number, required: false }, 
    numeroPrecioMaximo: { type: Number, required: false }, 
    numeroPrecioMinimo: { type: Number, required: false }, 
    precio1: { type: Number, required: false }, 
    precio2: { type: Number, required: false }, 
    precio3: { type: Number, required: false }, 
    precio4: { type: Number, required: false }, 
    precio5: { type: Number, required: false }, 
    precio6: { type: Number, required: false }, 
    precio7: { type: Number, required: false }, 
    precio8: { type: Number, required: false }, 
    precio9: { type: Number, required: false }, 
    precio10: { type: Number, required: false }, 
    porcentajePrecio1: { type: Number, required: false }, 
    porcentajePrecio2: { type: Number, required: false }, 
    porcentajePrecio3: { type: Number, required: false }, 
    porcentajePrecio4: { type: Number, required: false }, 
    porcentajePrecio5: { type: Number, required: false }, 
    porcentajePrecio6: { type: Number, required: false }, 
    porcentajePrecio7: { type: Number, required: false }, 
    porcentajePrecio8: { type: Number, required: false }, 
    porcentajePrecio9: { type: Number, required: false }, 
    porcentajePrecio10: { type: Number, required: false }, 
    rangoInicial1: { type: Number, required: false }, 
    rangoInicial2: { type: Number, required: false }, 
    rangoInicial3: { type: Number, required: false }, 
    rangoInicial4: { type: Number, required: false }, 
    rangoInicial5: { type: Number, required: false }, 
    rangoInicial6: { type: Number, required: false }, 
    rangoInicial7: { type: Number, required: false }, 
    rangoInicial8: { type: Number, required: false }, 
    rangoInicial9: { type: Number, required: false }, 
    rangoInicial10: { type: Number, required: false }, 
    rangoFinal1: { type: Number, required: false }, 
    rangoFinal2: { type: Number, required: false }, 
    rangoFinal3: { type: Number, required: false }, 
    rangoFinal4: { type: Number, required: false }, 
    rangoFinal5: { type: Number, required: false }, 
    rangoFinal6: { type: Number, required: false }, 
    rangoFinal7: { type: Number, required: false }, 
    rangoFinal8: { type: Number, required: false }, 
    rangoFinal9: { type: Number, required: false }, 
    rangoFinal10: { type: Number, required: false }, 
    porcentajeMonedero1: { type: Number, required: false }, 
    porcentajeMonedero2: { type: Number, required: false }, 
    porcentajeMonedero3: { type: Number, required: false }, 
    porcentajeMonedero4: { type: Number, required: false }, 
    porcentajeMonedero5: { type: Number, required: false }, 
    porcentajeMonedero6: { type: Number, required: false }, 
    porcentajeMonedero7: { type: Number, required: false }, 
    porcentajeMonedero8: { type: Number, required: false }, 
    porcentajeMoneder9: { type: Number, required: false }, 
    porcentajeMonedero10: { type: Number, required: false }, 
  },
  rutaImagen: {
    type: Number, required: false, 
  },
  proveedor: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'Proveedor', required: false 
  }, 
  esKit: {
    type: Boolean, required: false, 
  },
  esGrupo: {
    type: Boolean, required: false, 
  },
  productosAdicionales: [{ 
    type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false 
  }],
  productosGrupo: [{ 
    type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false 
  }], 
  productosKit: [{ 
    cantidad : {type: Number, required: false},
    visible: {type: Boolean, required: false},
    sumable: {type: Boolean, required: false},
    id: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
    costoTotal : {type: Number, required: false}
  }],
  productosComplementarios: [{ 
    type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false 
  }],
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: false }, 
  grupo: { type: mongoose.Schema.Types.ObjectId, ref: 'Grupo', required: false }, 
  marca: { type: mongoose.Schema.Types.ObjectId, ref: 'Marca', required: false }, 
  linea: { type: mongoose.Schema.Types.ObjectId, ref: 'Linea', required: false }, 
  departamento: { type: mongoose.Schema.Types.ObjectId, ref: 'Departamento', required: false }, 
  unidad: { type: mongoose.Schema.Types.ObjectId, ref: 'Unidad', required: false }, 
  impuesto: { type: mongoose.Schema.Types.ObjectId, ref: 'Impuesto', required: false }, 
  tax: {
    type: Number, required: false, 
  }
});

module.exports = mongoose.model('Product', productSchema);
