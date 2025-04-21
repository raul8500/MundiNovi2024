const Actividad = require('../../schemas/actividadesSchema/actividadesSchema');
const mongoose = require('mongoose');

exports.crearActividad = async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      esPeriodica,
      periodicidad,
      diasSemana,
      diaMes,
      fechaDesignada,
      horaInicio,
      horaFinal,
      usuariosAsignados
    } = req.body;

    // Validaciones adicionales si es necesario
    if (esPeriodica && !periodicidad) {
      return res.status(400).json({ message: 'Debe especificar la periodicidad si la actividad es periódica.' });
    }

    const nuevaActividad = new Actividad({
      titulo,
      descripcion,
      esPeriodica,
      periodicidad,
      diasSemana,
      diaMes,
      fechaDesignada,
      horaInicio,
      horaFinal,
      usuariosAsignados,
      finalizada: false
    });

    const actividadGuardada = await nuevaActividad.save();
    res.status(201).json({ message: 'Actividad creada con éxito.', actividad: actividadGuardada });
  } catch (error) {
    console.error('Error al crear actividad:', error);
    res.status(500).json({ message: 'Error al crear actividad.', error });
  }
};

exports.obtenerActividadesPorUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
      return res.status(400).json({ message: 'ID de usuario inválido.' });
    }

    const actividades = await Actividad.find({ usuariosAsignados: usuarioId })
      .populate({
        path: 'usuariosAsignados',
        populate: {
          path: 'sucursalId',
          select: 'nombre' // Incluye campos de la sucursal
        }
      });

    res.status(200).json({ actividades });
  } catch (error) {
    console.error('Error al obtener actividades por usuario:', error);
    res.status(500).json({ message: 'Error al obtener actividades.', error });
  }
};

exports.obtenerActividadPorId = async (req, res) => {
  try {
    const { actividadId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(actividadId)) {
      return res.status(400).json({ message: 'ID de actividad inválido.' });
    }

    const actividad = await Actividad.findById(actividadId)
      .populate({
        path: 'usuariosAsignados',
        populate: {
          path: 'sucursalId',
          select: 'nombre' // Incluye campos de la sucursal
        }
      });

    if (!actividad) {
      return res.status(404).json({ message: 'Actividad no encontrada.' });
    }

    res.status(200).json({ actividad });
  } catch (error) {
    console.error('Error al obtener actividad:', error);
    res.status(500).json({ message: 'Error al obtener actividad.', error });
  }
};

exports.obtenerTodasLasActividades = async (req, res) => {
  try {
    const actividades = await Actividad.find({})
      .populate({
        path: 'usuariosAsignados',
        populate: {
          path: 'sucursalId',
          select: 'nombre' // Incluye campos de la sucursal
        }
      });

    res.status(200).json({ actividades });
  } catch (error) {
    console.error('Error al obtener todas las actividades:', error);
    res.status(500).json({ message: 'Error al obtener actividades.', error });
  }
};

exports.marcarComoFinalizada = async (req, res) => {
  try {
    const { actividadId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(actividadId)) {
      return res.status(400).json({ message: 'ID de actividad inválido.' });
    }

    const actividad = await Actividad.findByIdAndUpdate(
      actividadId,
      { finalizada: true },
      { new: true } // Devuelve el documento actualizado
    );

    if (!actividad) {
      return res.status(404).json({ message: 'Actividad no encontrada.' });
    }

    res.status(200).json({ message: 'Actividad marcada como finalizada.', actividad });
  } catch (error) {
    console.error('Error al marcar actividad como finalizada:', error);
    res.status(500).json({ message: 'Error al marcar actividad como finalizada.', error });
  }
};

exports.eliminarActividad = async (req, res) => {
  try {
    const { actividadId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(actividadId)) {
      return res.status(400).json({ message: 'ID de actividad inválido.' });
    }

    const actividadEliminada = await Actividad.findByIdAndDelete(actividadId);

    if (!actividadEliminada) {
      return res.status(404).json({ message: 'Actividad no encontrada.' });
    }

    res.status(200).json({ message: 'Actividad eliminada con éxito.', actividad: actividadEliminada });
  } catch (error) {
    console.error('Error al eliminar actividad:', error);
    res.status(500).json({ message: 'Error al eliminar actividad.', error });
  }
};

exports.excluirDiaEspecifico = async (req, res) => {
  try {
    const { actividadId } = req.params;
    const { fecha } = req.body; // Fecha en formato YYYY-MM-DD

    if (!mongoose.Types.ObjectId.isValid(actividadId)) {
      return res.status(400).json({ message: 'ID de actividad inválido.' });
    }

    if (!fecha) {
      return res.status(400).json({ message: 'Se requiere una fecha para excluir.' });
    }

    const actividad = await Actividad.findById(actividadId);

    if (!actividad) {
      return res.status(404).json({ message: 'Actividad no encontrada.' });
    }

    if (!actividad.esPeriodica) {
      return res.status(400).json({ message: 'La actividad no es periódica. No se pueden excluir fechas.' });
    }

    // Validar si la fecha ya está en las excepciones
    const fechaISO = new Date(fecha).toISOString().split('T')[0];
    const excepcionesISO = actividad.excepciones.map(exc => exc.toISOString().split('T')[0]);

    if (excepcionesISO.includes(fechaISO)) {
      return res.status(400).json({ message: 'La fecha ya está en las excepciones.' });
    }

    // Agregar la fecha a las excepciones
    actividad.excepciones.push(fecha);
    await actividad.save();

    res.status(200).json({ message: 'Fecha excluida con éxito.', excepciones: actividad.excepciones });
  } catch (error) {
    console.error('Error al excluir fecha:', error);
    res.status(500).json({ message: 'Error al excluir fecha.', error });
  }
};

exports.marcarEstadoPorFecha = async (req, res) => {
    try {
        const { actividadId } = req.params;
        const { fecha, estado } = req.body; // Fecha: YYYY-MM-DD, Estado: true/false

        if (!mongoose.Types.ObjectId.isValid(actividadId)) {
            return res.status(400).json({ message: 'ID de actividad inválido.' });
        }

        if (!fecha || typeof estado !== 'boolean') {
            return res.status(400).json({ message: 'Fecha y estado son requeridos.' });
        }

        const actividad = await Actividad.findById(actividadId);

        if (!actividad) {
            return res.status(404).json({ message: 'Actividad no encontrada.' });
        }

        // Si la fecha ya está marcada como finalizada y se intenta finalizar nuevamente, eliminarla
        if (actividad.estadosPorFecha.get(fecha) === true && estado === true) {
            actividad.estadosPorFecha.delete(fecha); // Eliminar la fecha del estado
        } else {
            // De lo contrario, actualizar o agregar el estado para la fecha específica
            actividad.estadosPorFecha.set(fecha, estado);
        }

        await actividad.save();

        res.status(200).json({ message: 'Estado actualizado con éxito.', actividad });
    } catch (error) {
        console.error('Error al actualizar el estado:', error);
        res.status(500).json({ message: 'Error al actualizar el estado.', error });
    }
};

exports.reagendarActividad = async (req, res) => {
    const { id } = req.params;
    const { nuevaFecha, horaInicio, horaFinal, fechaOriginal } = req.body;

    try {
        // Validar datos de entrada
        if (!nuevaFecha || !horaInicio || !horaFinal || !fechaOriginal) {
            return res.status(400).json({ error: 'Faltan datos para reagendar la actividad.' });
        }

        // Buscar la actividad original
        const actividadOriginal = await Actividad.findById(id);
        if (!actividadOriginal) {
            return res.status(404).json({ error: 'Actividad original no encontrada.' });
        }

        actividadOriginal.finalizada = true
        actividadOriginal.save()

        // Crear una copia de la actividad
        const nuevaActividad = new Actividad({
            titulo: `${actividadOriginal.titulo} (Reagendada)`,
            descripcion: `${actividadOriginal.descripcion || ''} (Reagendada desde: ${fechaOriginal})`,
            esPeriodica: false, // Siempre será no periódica
            periodicidad: null, // Sin periodicidad
            diasSemana: [], // No aplica
            diaMes: null, // No aplica
            fechaDesignada: new Date(nuevaFecha),
            horaInicio,
            esReagendada: true,
            horaFinal,
            usuariosAsignados: actividadOriginal.usuariosAsignados,
            finalizada: false, // Nueva actividad siempre inicia sin finalizar
            excepciones: [], // No aplica
            estadosPorFecha: {} // Vacío para actividades no periódicas
        });

        // Guardar la nueva actividad en la base de datos
        await nuevaActividad.save();

        res.status(201).json({
            message: 'Actividad reagendada exitosamente.',
            actividad: nuevaActividad
        });
    } catch (error) {
        console.error('Error al reagendar actividad:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

exports.obtenerNumeroActividadesPorUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
      return res.status(400).json({ message: 'ID de usuario inválido.' });
    }

    const actividades = await Actividad.find({ usuariosAsignados: usuarioId });

    const hoy = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const diaSemanaHoy = new Date().toLocaleString('es-MX', { weekday: 'long' }).toLowerCase();
    const diaMesHoy = new Date().getDate();

    let actividadesPendientes = [];

    for (const act of actividades) {
      const estadosRaw = act.estadosPorFecha || {};

      // 🔍 Convertir a objeto plano en caso de ser Map (Mongoose)
      const estados = estadosRaw instanceof Map 
        ? Object.fromEntries(estadosRaw.entries()) 
        : estadosRaw;

      const tieneEstadoFinalizado = Object.values(estados).some(v => v === true);

      // 🪵 LOGS DE DEPURACIÓN
      console.log(`📅 Hoy: ${hoy}`);
      console.log(`📅 FechaDesignada: ${act.fechaDesignada?.toISOString().split('T')[0]}`);
      console.log(`🔁 Es periódica: ${act.esPeriodica}`);
      console.log(`✅ Marcada como finalizada: ${act.finalizada}`);
      console.log(`📊 Estados por fecha:`, estados);
      console.log(`🟡 No es periódica. ¿Tiene fecha finalizada en estadosPorFecha? ${tieneEstadoFinalizado}`);

      if (!act.esPeriodica && (act.finalizada || tieneEstadoFinalizado)) {
        console.log("✅ Actividad no periódica ya finalizada por estado o manual -> ignorada");
        continue;
      }

      if (!act.esPeriodica) {
        const esParaHoy = act.fechaDesignada?.toISOString().split('T')[0] === hoy;
        if (esParaHoy && !tieneEstadoFinalizado && !act.finalizada) {
          actividadesPendientes.push({ id: act._id, motivo: 'no periódica activa con fecha hoy' });
        }
      } else {
        // ⏳ Actividades periódicas
        const marcadaHoy = estados[hoy] === true;

        if (act.periodicidad === 'diaria' && !marcadaHoy) {
          actividadesPendientes.push({ id: act._id, motivo: 'diaria sin marca hoy' });
        }

        if (act.periodicidad === 'semanal' && act.diasSemana.includes(diaSemanaHoy) && !marcadaHoy) {
          actividadesPendientes.push({ id: act._id, motivo: 'semanal sin marca hoy' });
        }

        if (act.periodicidad === 'mensual' && act.diaMes === diaMesHoy && !marcadaHoy) {
          actividadesPendientes.push({ id: act._id, motivo: 'mensual sin marca hoy' });
        }
      }
    }

    res.status(200).json({
      totalPendientes: actividadesPendientes.length,
      actividadesPendientes
    });

  } catch (error) {
    console.error('Error al obtener actividades por usuario:', error);
    res.status(500).json({ message: 'Error al obtener actividades.', error });
  }
};
