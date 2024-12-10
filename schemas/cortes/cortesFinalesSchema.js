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
    T_cobranzas: { type: Number, required: false, default: 0 },  
    monto_doc_cobrar: { type: Number, required: false, default: 0  }, 
    venta_efectivo: { type: Number, required: false, default: 0  }, 
    T_credito: { type: Number, required: false, default: 0  }, 
    T_debito: { type: Number, required: false, default: 0  }, 
    total_tarjetas: { type: Number, required: false, default: 0  }, 
    transferencias: { type: Boolean, required: false, default: 0  }, 
    monto_transferencias: { type: Number, required: false, default: 0  }, 
    devolucion_ventas: { type: Number, required: false, default: 0  },  
    egresos: { type: Number, required: false, default: 0  },  
    cortes: [ { type: String, required: false } ],
    salidas: { type: Number, required: false },  
    ind_ventas: { type: Number, required: false },  
    total_ventas: { type: Number, required: false, default: 0  },  
    corte_total: { type: Number, required: false, default: 0  },
    totalVentasEfectivoCortes: { type: Number, required: false, default: 0  },
    totalVentaCorte: { type: Number, required: false, default: 0  },
    ventas: [ 
        {
            venta: { type: mongoose.Schema.Types.ObjectId, ref: 'Ventas', required: false },
            contada: { type: Boolean, required: false }
        }
    ],
    sucursal: { type: mongoose.Schema.Types.ObjectId, ref: 'sucursal', required: false }, 
    corteFinal: 
        {
            cantidad: { type: Number, required: false },
            observaciones: { type: String, required: false }
        }
});

module.exports = mongoose.model('CorteFinal', corteFinalSchema);


