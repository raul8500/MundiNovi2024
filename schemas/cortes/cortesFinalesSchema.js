const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const corteFinalSchema = new Schema({
    folio: { type: String, required: false }, 
    fecha_inicial: { type: Date, required: false },
    fecha_final: { type: Date, required: false },  
    sucursal: { type: mongoose.Schema.Types.ObjectId, ref: 'sucursal', required: false }, 
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: false },  
    usuario_recepcion: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: false }, 
    fecha_recepcion: { type: Date, required: false },
    recepcion: { type: Boolean, required: false },  
    observaciones: { type: String, required: false, default: '' },
    finanzasTotales: {
        T_cobranzas: { type: Number, required: false, default: 0 },  
        T_monto_doc_cobrar: { type: Number, required: false, default: 0  }, 
        T_efectivo: { type: Number, required: false, default: 0  }, 
        T_credito: { type: Number, required: false, default: 0  }, 
        T_debito: { type: Number, required: false, default: 0  }, 
        T_transferencias: { type: Number, required: false, default: 0  },
        T_monedero: { type: Number, required: false, default: 0  },
        T_tarjetas: { type: Number, required: false, default: 0  },
    },
    totalVentasEfectivoSinCortes: { type: Number, required: false, default: 0  },  
    total_ventas: { type: Number, required: false, default: 0  },
    devolucionones: { type: Number, required: false, default: 0  },  
    egresos: { type: Number, required: false, default: 0  },
    ingresos: { type: Number, required: false, default: 0  },
    cortesParciales: [{
        folio: { type: String, required: false },
        total: {type: Number, required: false}
    }],
    indicadorVentas: { type: Number, required: false },  
    ventas: [ 
        { type: mongoose.Schema.Types.ObjectId, ref: 'Ventas', required: false }
    ],
    corteFinal:
        {
            corte_total: { type: Number, required: false},
            observaciones: { type: String, required: false }
        }
});

module.exports = mongoose.model('CorteFinal', corteFinalSchema);


