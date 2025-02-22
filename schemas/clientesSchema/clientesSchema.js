const mongoose = require('mongoose');


const clientSchema = new mongoose.Schema({
    esfactura: { type: Boolean, require: true },
    estado: { type: Boolean, default: true },
    idAlegra: {type: String, require: false },
    zonaCliente: { type: mongoose.Schema.Types.ObjectId, ref: 'ZonaCliente', required: false },
    clientData: {
        thirdType:{type: String, require: false },
        regime: {type: String, require: false },
        name: {type: String, require: false },
        identification: {type: String, require: false },
        regimeObject: [{type: String, require: false }],
        phonePrimary: {type: String, require: false },
        mobile: {type: String, require: false },
        email: {type: String, require: false },
        status: {type: String, require: false },
        address: {
            street: {type: String, require: false },
            exteriorNumber: {type: String, require: false },
            interiorNumber: {type: String, require: false },
            colony: {type: String, require: false },
            locality: {type: String, require: false },
            municipality: {type: String, require: false },
            state: {type: String, require: false },
            zipCode: {type: String, require: false },
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

