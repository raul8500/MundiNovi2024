const mongoose = require('mongoose');

const actividadSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    esPeriodica: {
        type: Boolean,
        required: true
    },
    esReagendada: {
        type: Boolean,
        required: false
    },
    periodicidad: {
        type: String,
        enum: ['diaria', 'semanal', 'mensual', null], // Null si no es periódica
        default: null
    },
    diasSemana: {
        type: [String],
        enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
        default: []
    },
    diaMes: {
        type: Number,
        min: 1,
        max: 31,
        default: null
    },
    fechaDesignada: {
        type: Date,
        default: null
    },
    horaInicio: {
        type: String,
        required: true
    },
    horaFinal: {
        type: String,
        required: true
    },
    usuariosAsignados: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'users',
        required: true
    },
    finalizada: {
        type: Boolean,
        default: false
    },
    excepciones: {
        type: [Date],
        default: []
    },
    estadosPorFecha: {
        type: Map,
        of: Boolean, // Clave: Fecha (YYYY-MM-DD), Valor: true/false
        default: {}
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Actividad', actividadSchema);
