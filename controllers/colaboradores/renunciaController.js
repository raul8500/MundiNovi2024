const Renuncia = require("../../schemas/colaboradoresSchema/renunciaSchema");
const Colaborador = require("../../schemas/colaboradoresSchema/colaboradoresSchema");

// 🚀 Obtener carta de renuncia con datos del colaborador y testigos
exports.obtenerRenunciaConDatos = async (req, res) => {
    try {
        const { idColaborador } = req.params;
        const { testigo1, testigo2 } = req.query; // Recibir testigos desde el frontend

        // 📌 Obtener la plantilla de renuncia
        let renuncia = await Renuncia.findOne();
        if (!renuncia) {
            return res.status(404).json({ message: "Plantilla de renuncia no encontrada" });
        }

        // 📌 Obtener los datos del colaborador
        const colaborador = await Colaborador.findById(idColaborador);
        if (!colaborador) {
            return res.status(404).json({ message: "Colaborador no encontrado" });
        }

        // 📌 Obtener la fecha actual en formato día/mes/año
        const fechaActual = new Date().toLocaleDateString("es-ES");

        // 📌 Reemplazar placeholders en el documento
        let renunciaPersonalizada = renuncia.contenido
            .replace(/{colaborador}/g, `${colaborador.datos_personales.nombres} ${colaborador.datos_personales.apellido_paterno} ${colaborador.datos_personales.apellido_materno}`)
            .replace(/{domicilio}/g, colaborador.datos_personales.domicilio)
            .replace(/{fecha_actual}/g, fechaActual)
            .replace(/{testigo1}/g, testigo1 || "______________________")
            .replace(/{testigo2}/g, testigo2 || "______________________");

        res.json({
            renuncia: renunciaPersonalizada,
            colaborador: `${colaborador.datos_personales.nombres} ${colaborador.datos_personales.apellido_paterno} ${colaborador.datos_personales.apellido_materno}`
        });

    } catch (error) {
        console.error("Error al generar renuncia:", error);
        res.status(500).json({ message: "Error al generar la carta de renuncia" });
    }
};

// 🚀 Subir o actualizar la plantilla de renuncia
exports.subirPlantillaRenuncia = async (req, res) => {
    try {
        const { contenido } = req.body;

        let renuncia = await Renuncia.findOne();

        if (renuncia) {
            renuncia.contenido = contenido;
            await renuncia.save();
            return res.json({ message: "Plantilla de renuncia actualizada" });
        }

        renuncia = new Renuncia({ contenido });
        await renuncia.save();
        res.json({ message: "Plantilla de renuncia creada" });

    } catch (error) {
        console.error("Error al guardar plantilla de renuncia:", error);
        res.status(500).json({ message: "Error al guardar la plantilla de renuncia" });
    }
};

// 🚀 Obtener la plantilla base de renuncia desde la BD
exports.obtenerPlantillaRenuncia = async (req, res) => {
    try {
        let renuncia = await Renuncia.findOne();
        if (!renuncia) {
            return res.json({ renuncia: "" }); // Si no hay plantilla, devuelve vacío
        }
        res.json({ renuncia: renuncia.contenido });
    } catch (error) {
        console.error("Error al obtener la plantilla de renuncia:", error);
        res.status(500).json({ message: "Error al cargar la plantilla de renuncia" });
    }
};
