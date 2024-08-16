const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  date: { type: Date, required: true },
  text: { type: String, required: true },
  sucursal: { type: mongoose.Schema.Types.ObjectId, ref: 'sucursal' } // Referencia a sucursal
});

module.exports = mongoose.model('Message', messageSchema);
