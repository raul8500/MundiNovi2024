const mongoose = require('mongoose');

const ProductoStockSchema = new mongoose.Schema({
  reference: { type: String, required: true }, // Referencia del producto
  stockMinimo: { type: Number, required: true }, // Stock mínimo del producto
  stockMaximo: { type: Number, required: true }, // Stock máximo del producto
});

const StockSchema = new mongoose.Schema({
  sucursalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sucursal', required: true, unique: true },
  productos: [ProductoStockSchema], // Array de productos con sus valores de stock
}, { timestamps: true });

module.exports = mongoose.model('Stock', StockSchema);
