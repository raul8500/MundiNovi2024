const mongoose = require("mongoose");

const CotizacionSchema = new mongoose.Schema({
    folio: { type: Number, required: true, unique: true },
    cliente: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
        nombre: { type: String, required: true },
        telefono: { type: String, required: true },
        correo: { type: String, required: true },
        direccion: { type: String, required: true },
    },
    sucursal: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'sucursal', required: true },
        nombre: { type: String, required: true },
        direccion: { type: String, required: true },
        telefono: { type: String, required: true },
    },
    productos: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            reference: { type: String, required: true },
            unidad: { type: String, required: false },
            nombre: { type: String, required: true },
            cantidad: { type: Number, required: true },
            precio: { type: Number, required: true },
            total: { type: Number, required: true },
        },
    ],
    totalGeneral: { type: Number, required: true },
    usuario: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
        nombre : { type: String, required: true},
        usuario: { type: String, required: true}
    }, // Referencia a la colección de usuarios
    fechaCreacion: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Cotizacion", CotizacionSchema);
