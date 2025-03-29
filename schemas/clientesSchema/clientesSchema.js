const mongoose = require('mongoose');


const clientSchema = new mongoose.Schema({
    esfactura: { type: Boolean, require: true },
    estado: { type: Boolean, default: true },
    idFacApi: {type: String, require: false },
    zonaCliente: { type: mongoose.Schema.Types.ObjectId, ref: 'ZonaCliente', required: false },
    clientData: {
        regime: {type: String, require: false },
        name: {type: String, require: false },
        identification: {type: String, require: false },
        mobile: {type: String, require: false },
        email: {type: String, require: false },
        address: {
            street: {type: String, require: false },
            exterior: {type: String, require: false },
            interior: {type: String, require: false },
            neighborhood: {type: String, require: false },
            city: {type: String, require: false },
            municipality: {type: String, require: false },
            state: {type: String, require: false },
            zip: {type: String, require: false },
            country: {type: String, require: false },
        },
    },
    monedero: { type: Number, require: true },
    login: {
        username: {type: String, require: true},
        pasword: {type: String, require: false}
     },

}, { timestamps: true });

// Exportar el esquema
module.exports = mongoose.model('Client', clientSchema);

