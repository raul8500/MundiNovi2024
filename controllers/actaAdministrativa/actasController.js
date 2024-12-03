const Acta = require('../../schemas/actasAdministrativasSchema/actasSchema');
const Usuario = require('../../schemas/usersSchema/usersSchema');
const TipoActa = require('../../schemas/actasAdministrativasSchema/tipoActaSchema');

// Generar mensajes predefinidos
const mensajes = {
    retardos: 'SIENDO {Hora} DEL DIA {dia}, SE EXTIENDE LA PRESENTE ACTA ADMINISTRATIVA AL SR. {nombre} POR LLEGAR FUERA DE SU HORARIO DE ENTRADA. FIRMAN AL CALCE LOS INTERESADOS Y TESTIGO.',
    faltas: 'SIENDO {Hora} DEL DIA {dia}, SE EXTIENDE LA PRESENTE ACTA ADMINISTRATIVA AL SR. {nombre} POR NO PRESENTARSE A LABORAR. FIRMAN AL CALCE LOS INTERESADOS Y TESTIGO.',
    faltaTicket: 'SIENDO {Hora} DEL DIA {dia}, SE EXTIENDE LA PRESENTE ACTA ADMINISTRATIVA AL SR. {nombre} POR NO ENTREGAR SU TICKET. FIRMAN AL CALCE LOS INTERESADOS Y TESTIGO.',
    fondoCaja: 'SIENDO {Hora} DEL DIA {dia}, SE EXTIENDE LA PRESENTE ACTA ADMINISTRATIVA AL SR. {nombre} POR IRREGULARIDADES EN EL FONDO DE CAJA. FIRMAN AL CALCE LOS INTERESADOS Y TESTIGO.',
    malaAtencion: 'SIENDO {Hora} DEL DIA {dia}, SE EXTIENDE LA PRESENTE ACTA ADMINISTRATIVA AL SR. {nombre} POR MALA ATENCIÓN AL CLIENTE. FIRMAN AL CALCE LOS INTERESADOS Y TESTIGO.',
    usoCelular: 'SIENDO {Hora} DEL DIA {dia}, SE EXTIENDE LA PRESENTE ACTA ADMINISTRATIVA AL SR. {nombre} POR USO EXCESIVO DEL CELULAR DURANTE SU JORNADA. FIRMAN AL CALCE LOS INTERESADOS Y TESTIGO.'
};
// Crear un acta
exports.crearActa = async (req, res) => {
    try {
        const { usuarioId, tipo } = req.body;

        // Buscar el tipo de acta en la base de datos
        const tipoActa = await TipoActa.findOne({ tipo });
        if (!tipoActa) {
            return res.status(400).send('Tipo de acta no válido.');
        }

        // Obtener información del usuario
        const usuario = await Usuario.findById(usuarioId);
        if (!usuario) {
            return res.status(404).send('Usuario no encontrado.');
        }

        // Reemplazar placeholders en el mensaje
        const fecha = new Date();
        const mensaje = tipoActa.mensaje
            .replace('{hora}', fecha.toLocaleTimeString())
            .replace('{dia}', fecha.toLocaleDateString())
            .replace('{nombre}', usuario.name);

        // Guardar el acta
        const nuevaActa = await Acta.create({ usuarioId, tipo, mensaje });
        res.status(201).send(nuevaActa);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};



// Obtener todas las actas administrativas
exports.getAllActas = async (req, res) => {
    try {
        const actas = await Acta.find()
            .populate('usuarioId') // Popula los datos del usuario
            .sort({ fecha: -1 }); // Ordenar por fecha descendente

        res.status(200).send(actas);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Obtener una acta administrativa por ID
exports.getActaById = async (req, res) => {
    try {
        const id = req.params.id;
        const acta = await Acta.findById(id)
            .populate('usuarioId'); // Popula los datos del usuario

        if (!acta) {
            return res.status(404).send('Acta no encontrada.');
        }

        res.status(200).send(acta);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Eliminar un acta administrativa por ID
exports.deleteActaById = async (req, res) => {
    try {
        const id = req.params.id;
        const actaEliminada = await Acta.findByIdAndDelete(id);

        if (!actaEliminada) {
            return res.status(404).send('Acta no encontrada.');
        }

        res.status(200).send({ message: 'Acta eliminada exitosamente.', acta: actaEliminada });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor.');
    }
};
