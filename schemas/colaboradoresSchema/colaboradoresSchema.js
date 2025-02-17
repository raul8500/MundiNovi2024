const mongoose = require('mongoose');

const ColaboradorSchema = new mongoose.Schema({
    datos_personales: {
        nombres: { type: String, required: true },
        apellido_paterno: { type: String, required: true },
        apellido_materno: { type: String, required: false },
        edad: { type: Number, required: true },
        sexo: { type: String, enum: ['Masculino', 'Femenino', 'Otro'], required: true },
        estado_civil: { type: String, enum: ['Soltero', 'Casado', 'Divorciado', 'Viudo', 'Unión Libre'], required: true },
        domicilio: { type: String, required: true },
        curp: { type: String, required: true, unique: true },
        rfc: { type: String, required: true, unique: true },
        ciudad: { type: String, required: true },
        nacionalidad: { type: String, required: true },
        fecha_nacimiento: { type: Date, required: true }
    },
    datos_empresa: {
        sucursales: { type: mongoose.Schema.Types.ObjectId, ref: 'sucursal', required: true },
        usuario_sistema: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: false }, 
        fecha_ingreso: { type: Date, required: true },
        tipo_contrato: { type: String, enum: ['Indeterminado', 'Temporal', 'Prueba', 'Honorarios'], required: true },
        hora_entrada: { type: String, required: true }, 
        hora_salida: { type: String, required: true }, 
        autorizacion_credito: { type: Boolean, default: false },
        funciones: { type: [String], required: true }, 
        sueldo: { type: Number, required: true },
        fecha_baja: { type: Date, required: false }, 
        estado: { type: Boolean, required: true }
    }
}, { timestamps: true });

module.exports = mongoose.model('Colaborador', ColaboradorSchema);
