const mongoose = require('mongoose');

const productoAlegraSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  reference: {
    type: String,
    required: true,
  },
  price: [
    {
      idPriceList: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  inventory: {
    unit: {
      type: String,
      required: true,
    },
  },
  tax: [
    {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      percentage: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ['active', 'inactive'],
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
    },
  ],
  productKey: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['product', 'service']
  },
});

module.exports = mongoose.model('ProductoAlegra', productoAlegraSchema);
