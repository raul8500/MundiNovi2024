const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cortesParcialesSchema = new Schema({
    billetes_1000: { type: Number, required: true },
    billetes_500: { type: Number, required: true },
    billetes_200: { type: Number, required: true },
    billetes_100: { type: Number, required: true },
    billetes_50: { type: Number, required: true },
    billetes_20: { type: Number, required: true },
    monedas_20: { type: Number, required: true },
    monedas_10: { type: Number, required: true },
    monedas_5: { type: Number, required: true },
    monedas_2: { type: Number, required: true },
    monedas_1: { type: Number, required: true },
    monedas_050: { type: Number, required: true },
    cantidad : { type: Number, required: true },
    observaciones: { type: String, required: false },
    folio: { type: String, required: true },
    folioPadre: { type: String, required: true },
    fechaCreacion: {type: Date, default: Date.now},

});

module.exports = mongoose.model('CortesParciales', cortesParcialesSchema);
