const mongoose = require('mongoose');

const evaluacionSchema = new mongoose.Schema({
    sucursalId: {
        type: mongoose.Schema.Types.ObjectId, // Referencia al ID de la sucursal
        required: true,
        ref: 'sucursal' // Suponiendo que tienes un modelo para Sucursal
    },
    evaluadorId: {
        type: mongoose.Schema.Types.ObjectId, // Referencia al ID del evaluador
        required: true,
        ref: 'users' // Suponiendo que tienes un modelo para Usuario
    },
    fechaHora: {
        type: Date,
        default: Date.now
    },
    ordenPisoVenta: { type: Number, default: 0 },
    limpiezaPisoVenta: { type: Number, default: 0 },
    ordenLimpiezaBodega: { type: Number, default: 0 },
    ordenLimpiezaBaño: { type: Number, default: 0 },
    ordenLimpiezaMostrador: { type: Number, default: 0 },
    limpiezaExterior: { type: Number, default: 0 },
    frenteoMercancia: { type: Number, default: 0 },
    limpiezaTambosGarrafas: { type: Number, default: 0 },
    uniformePresentacion: { type: Number, default: 0 },
    musicaPantallas: { type: Number, default: 0 },
    capturaRecepcionFaltantes: { type: Number, default: 0 },
    etiquetadoBaston: { type: Number, default: 0 },
    quimicosBuenasCondicionesPreparado: { type: Number, default: 0 },
    preciadoresPromocionales: { type: Number, default: 0 },
    codigosBarras: { type: Number, default: 0 },
    peps: { type: Number, default: 0 },
    segmentosPtsCalientesTorres: { type: Number, default: 0 },
    boteEscobas: { type: Number, default: 0 },
    arqueoMercancia: { type: Number, default: 0 },
    arqueoEfectivo: { type: Number, default: 0 },
    asignarActividades: { type: Number, default: 0 },
    recepcionCortes: { type: Number, default: 0 }
});

module.exports = mongoose.model('Evaluacion', evaluacionSchema);
