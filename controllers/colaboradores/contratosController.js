const Contrato = require('../../schemas/colaboradoresSchema/contratoSchema');
const Colaborador = require('../../schemas/colaboradoresSchema/colaboradoresSchema'); // Asegúrate de que tienes el modelo de Colaborador


// 🚀 Obtener el contrato actual
exports.obtenerContrato = async (req, res) => {
    try {
        let contrato = await Contrato.findOne(); // Buscamos el único contrato en la DB

        if (!contrato) {
            contrato = new Contrato({ contenido: "Aquí va el contrato por defecto." });
            await contrato.save();
        }

        res.json(contrato);
    } catch (error) {
        console.error("Error al obtener el contrato:", error);
        res.status(500).json({ message: "Error al obtener el contrato" });
    }
};

// 🚀 Actualizar el contrato
exports.actualizarContrato = async (req, res) => {
    try {
        const { contenido } = req.body;

        let contrato = await Contrato.findOne();

        if (!contrato) {
            contrato = new Contrato({ contenido });
        } else {
            contrato.contenido = contenido;
            contrato.ultimaActualizacion = Date.now();
        }

        await contrato.save();
        res.json({ message: "Contrato actualizado correctamente", contrato });
    } catch (error) {
        console.error("Error al actualizar el contrato:", error);
        res.status(500).json({ message: "Error al actualizar el contrato" });
    }
};

// 🚀 Obtener contrato con los datos del colaborador
exports.obtenerContratoConDatos = async (req, res) => {
    try {
        const { idColaborador } = req.params;

        // 🚀 Obtener contrato base de la base de datos
        let contrato = await Contrato.findOne();
        if (!contrato) {
            return res.status(404).json({ message: "Contrato no encontrado" });
        }

        // 🚀 Obtener los datos del colaborador
        const colaborador = await Colaborador.findById(idColaborador);
        if (!colaborador) {
            return res.status(404).json({ message: "Colaborador no encontrado" });
        }

        // 🚀 Datos estáticos del gerente
        const gerenteNombre = "Jesús Maria Aguirre Vega";
        const gerentePuesto = "Gerente General";
        const fechaActual = new Date().toLocaleDateString("es-ES");


        // 🚀 Reemplazar placeholders en el contrato con los datos reales
        let contratoPersonalizado = contrato.contenido
            .replace(/{fecha_contrato}/g, fechaActual)
            .replace(/{colaborador_nacionalidad}/g, colaborador.datos_personales.nacionalidad)
            .replace(/{colaborador}/g, `${colaborador.datos_personales.nombres} ${colaborador.datos_personales.apellido_paterno} ${colaborador.datos_personales.apellido_materno}`)
            .replace(/{colaborador_edad}/g, colaborador.datos_personales.edad)
            .replace(/{colaborador_estado_civil}/g, colaborador.datos_personales.estado_civil)
            .replace(/{colaborador_domicilio}/g, colaborador.datos_personales.domicilio)
            .replace(/{colaborador_ciudad}/g, colaborador.datos_personales.ciudad)
            .replace(/{colaborador_curp}/g, colaborador.datos_personales.curp)
            .replace(/{colaborador_rfc}/g, colaborador.datos_personales.rfc)
            .replace(/{colaborador_sexo}/g, colaborador.datos_personales.sexo)
            .replace(/{sueldo}/g, colaborador.datos_empresa.sueldo)
            .replace(/{tipo_contrato}/g, colaborador.datos_empresa.tipo_contrato)
            .replace(/{hora_entrada}/g, colaborador.datos_empresa.hora_entrada)
            .replace(/{hora_salida}/g, colaborador.datos_empresa.hora_salida)
            .replace(/{funciones}/g, colaborador.datos_empresa.funciones.join(', '))
            .replace(/{gerente_nombre}/g, gerenteNombre)
            .replace(/{gerente_puesto}/g, gerentePuesto);

        res.json({
            contrato: contratoPersonalizado,
            gerente_nombre: gerenteNombre,
            colaborador: `${colaborador.datos_personales.nombres} ${colaborador.datos_personales.apellido_paterno} ${colaborador.datos_personales.apellido_materno}`
        });

    } catch (error) {
        console.error("Error al obtener contrato personalizado:", error);
        res.status(500).json({ message: "Error al generar el contrato" });
    }
};
