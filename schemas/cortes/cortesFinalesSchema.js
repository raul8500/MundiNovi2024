const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const corteFinalSchema = new Schema({
    folio: { type: String, required: false }, 
    fecha_inicial: { type: Date, required: false },
    fecha_final: { type: Date, required: false },  
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: false },  
    recepcion: { type: Boolean, required: false },  
    usuario_recepcion: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: false }, 
    fecha_recepcion: { type: Date, required: false },  
    T_cobranzas: { type: Number, required: false },  
    monto_doc_cobrar: { type: Number, required: false }, 
    venta_efectivo: { type: Number, required: false }, 
    T_credito: { type: Number, required: false }, 
    T_debito: { type: Number, required: false }, 
    total_tarjetas: { type: Number, required: false }, 
    transferencias: { type: Boolean, required: false }, 
    monto_transferencias: { type: Number, required: false }, 
    devolucion_ventas: { type: Number, required: false },  
    cortes: [ { type: mongoose.Schema.Types.ObjectId, ref: 'CortesParciales', required: false } ],
    salidas: { type: Number, required: false },  
    ind_ventas: { type: Number, required: false },  
    total_ventas: { type: Number, required: false },  
    corte_total: { type: Number, required: false },
    totalVentasEfectivoCortes: { type: Number, required: false },
    totalVentaCorte: { type: Number, required: false },
    ventas: [ 
        {
            venta: { type: mongoose.Schema.Types.ObjectId, ref: 'Ventas', required: false },
            contada: { type: Boolean, required: false }
        }
    ],
});

module.exports = mongoose.model('CorteFinal', corteFinalSchema);

