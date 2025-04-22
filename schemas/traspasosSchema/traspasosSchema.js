const mongoose = require('mongoose');

const ProductoRecepcionDestino = new mongoose.Schema({
    reference: { type: String, required: true }, // Referencia del producto
    name: { type: String, required: true }, // Nombre del producto
    cantidad: { type: Number, required: true }, // Cantidad traspasada
});

const ProductoRecepcionReparto = new mongoose.Schema({
    reference: { type: String, required: true }, // Referencia del producto
    name: { type: String, required: true }, // Nombre del producto
    cantidad: { type: Number, required: true }, // Cantidad traspasada
});

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
    folio: { type: Number, unique: true, required: true }, // Folio numérico incremental
    sucursalOrigen: { type: mongoose.Schema.Types.ObjectId, ref: 'sucursal', required: true },
    sucursalDestino: { type: mongoose.Schema.Types.ObjectId, ref: 'sucursal', required: true },
    usuarioOrigen: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    usuarioDestino: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    fecha: { type: Date, default: Date.now },
    observaciones: { type: String, default: '' },
    productos: [ProductoTraspasoSchema],
    productosReparto: [ProductoRecepcionReparto],
    productosDestino: [ProductoRecepcionDestino],
    usuarioReparto: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: false },
    estado: {type: Number, required: false},
    esFinalizado: {type: Boolean, required: false}
});


module.exports = mongoose.model('Traspaso', TraspasoSchema);
