const mongoose = require('mongoose');

const datosFiscalesSchema = new mongoose.Schema({
    nombrePropietario: {
        type: String,
        required: true
    },
    regimenFiscal: {
        type: String,
        required: true
    },
    direccionFiscal: {
        type: String,
        required: true
    },
    colonia: {
        type: String,
        required: true
    },
    ciudad: {
        type: String,
        required: true
    },
    codigoPostal: {
        type: String,
        required: true
    },
    rfc: {
        type: String,
        required: true
    },
    telefonos: {
        type: [String], // Array de números de teléfono
        required: true
    },
    correoFacturacion: {
        type: String,
        required: true
    }
});

const franquiciaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    sitioWeb: {
        type: String,
        required: false
    },
    encargado: {
        type: String,
        required: true
    },
    razonSocial: {
        type: String,
        required: true
    },
    porcentajePrecio1: {
        type: Number,
        required: false
    },
    porcentajePrecio2: {
        type: Number,
        required: false
    },
    porcentajePrecio3: {
        type: Number,
        required: false
    },
    porcentajePrecio4: {
        type: Number,
        required: false
    },
    porcentajePrecio5: {
        type: Number,
        required: false
    },
    porcentajePrecio6: {
        type: Number,
        required: false
    },
    porcentajePrecio7: {
        type: Number,
        required: false
    },
    porcentajePrecio8: {
        type: Number,
        required: false
    },
    porcentajePrecio9: {
        type: Number,
        required: false
    },
    porcentajePrecio10: {
        type: Number,
        required: false
    },
    mensajeTicket: {
        type: String,
        required: false
    },
    permitirVenta: {
        type: Boolean,
        required: true,
        default: true
    },
    datosFiscales: {
        type: datosFiscalesSchema,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

const Franquicia = mongoose.model('franquicia', franquiciaSchema);

module.exports = Franquicia;
