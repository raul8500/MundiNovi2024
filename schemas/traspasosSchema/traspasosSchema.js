const mongoose = require('mongoose');

const ProductoTraspasoSchema = new mongoose.Schema({
    reference: { type: String, required: true }, // Referencia del producto
    name: { type: String, required: true }, // Nombre del producto
    presentacion: { type: String, required: true }, // Presentación
    cantidad: { type: Number, required: true }, // Cantidad traspasada
    existenciaOrigen: { type: Number, required: true }, // Existencia en la sucursal origen
    existenciaDestino: { type: Number, required: true }, // Existencia en la sucursal destino
    stockMinimo: { type: Number, required: true }, // Stock mínimo
    stockMaximo: { type: Number, required: true }, // Stock máximo
    volumen: { type: Number, default: 0 }, // Volumen
    peso: { type: Number, default: 0 } // Peso
});

const TraspasoSchema = new mongoose.Schema({
    sucursalOrigen: { type: mongoose.Schema.Types.ObjectId, ref: 'Sucursal', required: true },
    sucursalDestino: { type: mongoose.Schema.Types.ObjectId, ref: 'Sucursal', required: true },
    usuarioOrigen: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    usuarioDestino: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    fecha: { type: Date, default: Date.now },
    observaciones: { type: String, default: '' },
    productos: [ProductoTraspasoSchema], // Array de productos traspasados
    estado: { type: String, enum: ['pendiente', 'completado'], default: 'pendiente' } // Estado del traspaso
});

module.exports = mongoose.model('Traspaso', TraspasoSchema);
