const mongoose = require('mongoose');

const inventarioSchema = new mongoose.Schema({
    folio: {
        type: Number,
        required: true,
        unique: true
    },
    sucursal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sucursal',
        required: true
    },
    encargado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Referencia al modelo de usuarios
        required: true
    },
    estado: {
        type: Boolean,
        required: true,
        default: false
    },
    productos: [
        {
            referencia: {
                type: String,
                required: true
            },
            existenciaFisica: {
                type: Number,
                required: true,
                default: 0
            },
            existenciaContable: {
                type: Number,
                required: true,
                default: 0
            }
        }
    ],
    productosConMovimiento: [
        {
            referencia: {
                type: String,
                required: true
            },
            descripcion: {
                type: String,
                required: true
            },
            existenciaFisica: {
                type: Number,
                required: true,
                default: 0
            },
            existenciaContable: {
                type: Number,
                required: true,
                default: 0
            },
            diferencia: {
                type: Number,
                required: true,
                default: 0
            },
            costo: {
                type: Number,
                required: true,
                default: 0
            },
            importe: {
                type: Number,
                required: true,
                default: 0
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Inventario', inventarioSchema);
