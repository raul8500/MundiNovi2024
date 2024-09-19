const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const formulaProduccionSchema = new Schema({
  productoFinal: {
    type: Schema.Types.ObjectId,
    ref: 'Product', 
    required: true,
  },
  nombreFormula: {
    type: String,
    required: true,
  },
  observaciones: {
    type: String,
  },
  paraQueCantidadEsLaFormula: {
    type: String,
  },
  materiasPrimas: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'MateriaPrima',
        required: true,
      },
      cantidad: {
        type: Number,
        required: true,
      }
    }
  ],
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  costoPorcion: {
    type: Number,
    required: true,
  },
  costoUnidad: {
    type: Number,
    required: true,
  },
});

const FormulaProduccion = mongoose.model('FormulaProduccion', formulaProduccionSchema);

module.exports = FormulaProduccion;
