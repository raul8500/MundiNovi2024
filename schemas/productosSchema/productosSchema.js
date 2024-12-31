const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['product', 'service'],
    required: false, // Ahora es opcional
  },
  reference: {
    type: String,
    required: false, // Ahora es opcional
  },
  esActivo: {
    type: Boolean,
    required: false, // Ahora es opcional
  },
  codigoBarra: {
    type: String,
    required: false, // Ahora es opcional
  },
  name: {
    type: String,
    required: false, // Ahora es opcional
  },
  productKey: {
    type: String,
    required: false, // Ahora es opcional
  },
  description: {
    type: String,
    required: false, // Ahora es opcional
  },
  inventory: {
    unit: {
      type: String,
      required: false, // Ahora es opcional
    },
  },
  tiempoSurtido: {
    type: Number,
    required: false, // Ahora es opcional
  },
  controlAlmacen: {
    type: Number,
    required: false, // Ahora es opcional
  },
  volumen: {
    type: Number,
    required: false, // Ahora es opcional
  },
  unidad: {
    type: String,
    required: false, // Ahora es opcional
  },
    presentacion: {
    type: Number,
    required: false, // Ahora es opcional
  },
  peso: {
    type: Number,
    required: false, // Ahora es opcional
  },
  datosFinancieros: {
    costo: { type: Number, required: false }, // Ahora es opcional
    ultimoCosto: { type: Number, required: false }, // Ahora es opcional
    costoPromedio: { type: Number, required: false }, // Ahora es opcional
    unidadEmpaque: { type: Number, required: false }, // Ahora es opcional
    precio1: { type: Number, required: false }, // Ahora es opcional
    precio2: { type: Number, required: false }, // Ahora es opcional
    precio3: { type: Number, required: false }, // Ahora es opcional
    precio4: { type: Number, required: false }, // Ahora es opcional
    precio5: { type: Number, required: false }, // Ahora es opcional
    precio6: { type: Number, required: false }, // Ahora es opcional
    precio7: { type: Number, required: false }, // Ahora es opcional
    precio8: { type: Number, required: false }, // Ahora es opcional
    precio9: { type: Number, required: false }, // Ahora es opcional
    precio10: { type: Number, required: false }, // Ahora es opcional
    porcentajePrecio1: { type: Number, required: false }, // Ahora es opcional
    porcentajePrecio2: { type: Number, required: false }, // Ahora es opcional
    porcentajePrecio3: { type: Number, required: false }, // Ahora es opcional
    porcentajePrecio4: { type: Number, required: false }, // Ahora es opcional
    porcentajePrecio5: { type: Number, required: false }, // Ahora es opcional
    porcentajePrecio6: { type: Number, required: false }, // Ahora es opcional
    porcentajePrecio7: { type: Number, required: false }, // Ahora es opcional
    porcentajePrecio8: { type: Number, required: false }, // Ahora es opcional
    porcentajePrecio9: { type: Number, required: false }, // Ahora es opcional
    porcentajePrecio10: { type: Number, required: false }, // Ahora es opcional
    rangoInicial1: { type: Number, required: false }, // Ahora es opcional
    rangoInicial2: { type: Number, required: false }, // Ahora es opcional
    rangoInicial3: { type: Number, required: false }, // Ahora es opcional
    rangoInicial4: { type: Number, required: false }, // Ahora es opcional
    rangoInicial5: { type: Number, required: false }, // Ahora es opcional
    rangoInicial6: { type: Number, required: false }, // Ahora es opcional
    rangoInicial7: { type: Number, required: false }, // Ahora es opcional
    rangoInicial8: { type: Number, required: false }, // Ahora es opcional
    rangoInicial9: { type: Number, required: false }, // Ahora es opcional
    rangoInicial10: { type: Number, required: false }, // Ahora es opcional
    rangoFinal1: { type: Number, required: false }, // Ahora es opcional
    rangoFinal2: { type: Number, required: false }, // Ahora es opcional
    rangoFinal3: { type: Number, required: false }, // Ahora es opcional
    rangoFinal4: { type: Number, required: false }, // Ahora es opcional
    rangoFinal5: { type: Number, required: false }, // Ahora es opcional
    rangoFinal6: { type: Number, required: false }, // Ahora es opcional
    rangoFinal7: { type: Number, required: false }, // Ahora es opcional
    rangoFinal8: { type: Number, required: false }, // Ahora es opcional
    rangoFinal9: { type: Number, required: false }, // Ahora es opcional
    rangoFinal10: { type: Number, required: false }, // Ahora es opcional
    porcentajeMonedero1: { type: Number, required: false }, // Ahora es opcional
    porcentajeMonedero2: { type: Number, required: false }, // Ahora es opcional
    porcentajeMonedero3: { type: Number, required: false }, // Ahora es opcional
    porcentajeMonedero4: { type: Number, required: false }, // Ahora es opcional
    porcentajeMonedero5: { type: Number, required: false }, // Ahora es opcional
    porcentajeMonedero6: { type: Number, required: false }, // Ahora es opcional
    porcentajeMonedero7: { type: Number, required: false }, // Ahora es opcional
    porcentajeMonedero8: { type: Number, required: false }, // Ahora es opcional
    porcentajeMoneder9: { type: Number, required: false }, // Ahora es opcional
    porcentajeMonedero10: { type: Number, required: false }, // Ahora es opcional
  },
  price: [
    {
      idPriceList: {
        type: Number,
        required: false, // Ahora es opcional
      },
      price: {
        type: Number,
        required: false, // Ahora es opcional
      },
    },
  ],
  linea: { type: mongoose.Schema.Types.ObjectId, ref: 'Linea', required: false }, // Ahora es opcional
  departamento: { type: mongoose.Schema.Types.ObjectId, ref: 'Departamento', required: false }, // Ahora es opcional
  marca: { type: mongoose.Schema.Types.ObjectId, ref: 'Marca', required: false }, // Ahora es opcional
  grupo: { type: mongoose.Schema.Types.ObjectId, ref: 'Grupo', required: false }, // Ahora es opcional
  tax: [
    {
      id: {
        type: String,
        required: false, // Ahora es opcional
      },
      name: {
        type: String,
        required: false, // Ahora es opcional
      },
      percentage: {
        type: String,
        required: false, // Ahora es opcional
      },
      status: {
        type: String,
        enum: ['active', 'inactive'],
        required: false, // Ahora es opcional
      },
      type: {
        type: String,
        required: false, // Ahora es opcional
      },
    },
  ],
  esKit: {
    type: Boolean,
    required: false, // Ahora es opcional
  },
  esGrupoProductos: {
    type: Boolean,
    required: false, // Ahora es opcional
  },
  kitProducto: [
    {
      producto: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: false, // Ahora es opcional
      },
      cantidad: { 
        type: Number, 
        required: false, // Ahora es opcional
      },
       esVisible: {
        type: Boolean,
        required: false, // Ahora es opcional
      },
      esSumable: {
        type: Boolean,
        required: false, // Ahora es opcional
      },
    }
  ],
  GrupoProducto: [
    {
      producto: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: false, // Ahora es opcional
      },
      cantidad: { 
        type: Number, 
        required: false, // Ahora es opcional
      }
    }
  ],
  idAlegra: {
    type: String,
    required: false, // Ahora es opcional
  }
});

module.exports = mongoose.model('Product', productSchema);
