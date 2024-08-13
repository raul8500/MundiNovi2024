const mongoose = require('mongoose');

const datosTicketSchema = new mongoose.Schema({
    direccion: {
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
    telefonos: {
        type: [String], // Array de números de teléfono
        required: true
    },
    tamanoTicket: {
        type: String,
        required: true
    }
});

const datosFiscalesSchema = new mongoose.Schema({
    razonSocial: {
        type: String,
        required: true
    },
    rfc: {
        type: String,
        required: true
    },
    direccionFiscal: {
        type: String,
        required: true
    }
});

const sucursalSchema = new mongoose.Schema({
    clave: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    mensajeTicket: {
        type: String,
        required: false
    },
    precioDevolucionMercancia: {
        type: Number,
        required: false
    },
    status: {
        type: String,
        required: true
    },
    datosTicket: {
        type: datosTicketSchema,
        required: true
    },
    datosFiscales: {
        type: datosFiscalesSchema,
        required: true
    },
    idFranquicia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'franquicia', // Referencia al modelo de franquicia
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

const Sucursal = mongoose.model('sucursal', sucursalSchema);

module.exports = Sucursal;
