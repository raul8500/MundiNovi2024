const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
    cotizacionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cotizacion',
        required: true
    },
    cliente: {
        idCliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
        nombre: { type: String, required: true },
        identificacion: { type: String },
        regimen: { type: String },
        telefonoPrincipal: { type: String },
        telefonoContacto: { type: String },
        correo: { type: String },
        direccion: {
            calle: { type: String },
            colonia: { type: String },
            localidad: { type: String },
            estado: { type: String },
            codigoPostal: { type: String }
        }
    },
    factura: {
        type: Boolean,
        required: true
    },
    entrega: {
        fecha: { type: Date, required: true },
        sucursal: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'sucursal', required: true },
            nombre: { type: String, required: true }
        }
    },
    productos: [{
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        reference: { type: String, required: true },
        nombre: { type: String, required: true },
        cantidad: { type: Number, required: true },
        precio: { type: Number, required: true },
        total: { type: Number, required: true }
    }],
    observaciones: {
        type: String
    },
    total: {
        type: Number,
        required: true
    },
    creadoEn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Pedido', pedidoSchema);
