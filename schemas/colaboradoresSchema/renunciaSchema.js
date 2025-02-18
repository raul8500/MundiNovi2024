const mongoose = require("mongoose");

const RenunciaSchema = new mongoose.Schema({
    contenido: { type: String, required: true } // 📌 Contiene la plantilla base con placeholders
});

module.exports = mongoose.model("Renuncia", RenunciaSchema);
