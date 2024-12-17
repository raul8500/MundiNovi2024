const mongoose = require("mongoose");

const CotizacionSchema = new mongoose.Schema({
    folio: { type: Number, required: true, unique: true },
    cliente: {
        nombre: { type: String, required: true },
        telefono: { type: String, required: true },
        correo: { type: String, required: true },
        direccion: { type: String, required: true },
    },
    sucursal: {
        nombre: { type: String, required: true },
        direccion: { type: String, required: true },
        telefono: { type: String, required: true },
    },
    productos: [
        {
            reference: { type: String, required: true },
            unidad: { type: String, required: false },
            nombre: { type: String, required: true },
            cantidad: { type: Number, required: true },
            precio: { type: Number, required: true },
            total: { type: Number, required: true },
        },
    ],
    totalGeneral: { type: Number, required: true },
    pdfPath: { type: String, required: true },
    usuario: {
        nombre : { type: String, required: true},
        usuario: { type: String, required: true}
    }, // Referencia a la colección de usuarios
    fechaCreacion: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Cotizacion", CotizacionSchema);
