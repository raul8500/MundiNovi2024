const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
    clave: {
        type: String,
        required: true,
        unique: true
    },
    datosGenerales: {
        nombre: {
            type: String,
            required: true
        },
        telefonoPersonal: {
            type: String
        },
        telefonoCelular: {
            type: String
        },
        correoElectronicoPersonal: {
            type: String
        },
        
        zonaCliente: {
            type: String
        }
    },
    datosUbicacion: {
        rfc: {
            type: String
        },
        razonSocial: {
            type: String
        },
        correoElectronicoContacto: {
            type: String
        },
        calle: {
            type: String
        },
        numeroExterior: {
            type: String
        },
        numeroInterior: {
            type: String
        },
        colonia: {
            type: String
        },
        localidad: {
            type: String
        },
        municipio: {
            type: String
        },
        estado: {
            type: String
        },
        pais: {
            type: String
        },
        codigoPostal: {
            type: String
        }
    },
    datosFinancieros: {
        diasDeCredito: {
            type: Number,
            default: 0
        },
        limiteDeCredito: {
            type: Number,
            default: 0
        },
        saldo: {
            type: Number,
            default: 0
        },
        diaDeRevision: {
            type: Number
        },
        diaDePago: {
            type: Number
        },
        descuento: {
            type: Number,
            default: 0
        },
        fechaUltimoPago: {
            type: Date
        },
        montoUltimoPago: {
            type: Number,
            default: 0
        }
    }
});

module.exports = mongoose.model('Cliente', clienteSchema);
