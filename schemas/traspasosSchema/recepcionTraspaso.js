const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// ✅ Esquema de Recepción de Traspaso
const RecepcionTraspasoSchema = new Schema({
    // ID del traspaso relacionado
    traspaso: {
        type: Schema.Types.ObjectId,
        ref: 'Traspaso',
        required: true
    },

    // Array de productos recibidos
    productos: [
        {
            _id: false,
            reference: {
                type: String,
                required: true
            },
            id: {
                type: String,
                required: true
            },
            cantidadRecibida: {
                type: Number,
                min: 0
            },
            presentacion: {
                type: String,
            }
        }
    ],

    // Fecha de recepción
    fechaRecepcion: {
        type: Date,
        default: Date.now
    },

    // Usuario que realizó la recepción
    usuarioRecepcion: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },

    // Observaciones adicionales
    observaciones: {
        type: String,
        default: ''
    }
});

// ✅ Crear el modelo
const RecepcionTraspaso = model('RecepcionTraspaso', RecepcionTraspasoSchema);

module.exports = RecepcionTraspaso;
