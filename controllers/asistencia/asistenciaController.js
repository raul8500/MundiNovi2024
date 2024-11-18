const Asistencia = require('../../schemas/asistenciaSchema/asistenciaSchema');
const mongoose = require('mongoose');

exports.registrarEntrada = async (req, res) => {
  try {
    const { usuarioId } = req.body;
    const hoy = new Date().toISOString().split('T')[0];

    // Verificar si ya se registró la entrada para hoy
    const registroExistente = await Asistencia.findOne({ usuarioId, fecha: hoy });
    if (registroExistente) {
      return res.status(400).json({ message: 'La entrada ya fue registrada hoy.' });
    }

    // Crear un nuevo registro
    const nuevaAsistencia = new Asistencia({
      usuarioId,
      fecha: hoy,
      acciones: { entrada: new Date().toISOString() }
    });

    await nuevaAsistencia.save();
    res.status(200).json({ message: 'Entrada registrada con éxito.' });
  } catch (error) {
    console.error('Error al registrar entrada:', error);
    res.status(500).json({ message: 'Error al registrar entrada.', error });
  }
};

exports.registrarSalidaComer = async (req, res) => {
  try {
    const { usuarioId } = req.body;
    const hoy = new Date().toISOString().split('T')[0];

    // Verificar si existe un registro de entrada para hoy
    const registro = await Asistencia.findOne({ usuarioId, fecha: hoy });
    if (!registro || !registro.acciones.entrada) {
      return res.status(400).json({ message: 'Debes registrar la entrada antes de registrar la salida a comer.' });
    }

    // Verificar si ya registró la salida a comer
    if (registro.acciones.salidaComer) {
      return res.status(400).json({ message: 'La salida a comer ya fue registrada hoy.' });
    }

    registro.acciones.salidaComer = new Date().toISOString();
    await registro.save();
    res.status(200).json({ message: 'Salida a comer registrada con éxito.' });
  } catch (error) {
    console.error('Error al registrar salida a comer:', error);
    res.status(500).json({ message: 'Error al registrar salida a comer.', error });
  }
};

exports.registrarRegresoComer = async (req, res) => {
  try {
    const { usuarioId } = req.body;
    const hoy = new Date().toISOString().split('T')[0];

    // Verificar si existe un registro de salida a comer para hoy
    const registro = await Asistencia.findOne({ usuarioId, fecha: hoy });
    if (!registro || !registro.acciones.salidaComer) {
      return res.status(400).json({ message: 'Debes registrar la salida a comer antes de registrar el regreso.' });
    }

    // Verificar si ya registró el regreso de comer
    if (registro.acciones.regresoComer) {
      return res.status(400).json({ message: 'El regreso de comer ya fue registrado hoy.' });
    }

    registro.acciones.regresoComer = new Date().toISOString();
    await registro.save();
    res.status(200).json({ message: 'Regreso de comer registrado con éxito.' });
  } catch (error) {
    console.error('Error al registrar regreso de comer:', error);
    res.status(500).json({ message: 'Error al registrar regreso de comer.', error });
  }
};

exports.registrarTerminoJornada = async (req, res) => {
  try {
    const { usuarioId } = req.body;
    const hoy = new Date().toISOString().split('T')[0];

    // Verificar si existe un registro de entrada para hoy
    const registro = await Asistencia.findOne({ usuarioId, fecha: hoy });
    if (!registro || !registro.acciones.entrada) {
      return res.status(400).json({ message: 'Debes registrar la entrada antes de registrar el término de jornada.' });
    }

    // Verificar si ya registró el término de jornada
    if (registro.acciones.terminoJornada) {
      return res.status(400).json({ message: 'El término de jornada ya fue registrado hoy.' });
    }

    registro.acciones.terminoJornada = new Date().toISOString();
    await registro.save();
    res.status(200).json({ message: 'Término de jornada registrado con éxito.' });
  } catch (error) {
    console.error('Error al registrar término de jornada:', error);
    res.status(500).json({ message: 'Error al registrar término de jornada.', error });
  }
};


exports.getAllAsistencias = async (req, res) => {
  try {
    const { usuarioId, fecha } = req.query; // Opcional: Filtros por usuario y fecha

    // Construir un filtro dinámico según los parámetros proporcionados
    const filtro = {};
    if (usuarioId) filtro.usuarioId = new mongoose.Types.ObjectId(usuarioId);
    if (fecha) filtro.fecha = fecha;

    // Obtener todas las asistencias con los filtros aplicados (si existen),
    // y poblar la información del usuario y de la sucursal asociada
    const asistencias = await Asistencia.find(filtro)
      .populate({
        path: 'usuarioId', // Poblar información del usuario
        populate: {
          path: 'sucursalId', // Poblar la sucursal dentro del usuario
        }
      });

    if (!asistencias || asistencias.length === 0) {
      return res.status(404).json({ message: 'No se encontraron asistencias registradas.' });
    }

    // Respuesta exitosa
    res.status(200).json(asistencias);
  } catch (error) {
    console.error('Error al obtener las asistencias:', error);
    res.status(500).json({ message: 'Error al obtener las asistencias.', error });
  }
};


exports.getAsistenciaByUsuarioForToday = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    // Validar que el usuarioId esté presente
    if (!usuarioId) {
      return res.status(400).json({ message: 'El usuarioId es obligatorio.' });
    }

    // Obtener la fecha actual del sistema en formato YYYY-MM-DD
    const hoy = new Date().toISOString().split('T')[0];

    // Buscar la asistencia del usuario para la fecha actual
    const asistencia = await Asistencia.findOne({
      usuarioId: new mongoose.Types.ObjectId(usuarioId),
      fecha: hoy,
    });

    if (!asistencia) {
      return res.status(404).json({ message: `No se encontró asistencia para el usuario en la fecha actual (${hoy}).` });
    }

    // Respuesta exitosa
    res.status(200).json(asistencia);
  } catch (error) {
    console.error('Error al obtener la asistencia del usuario para el día actual:', error);
    res.status(500).json({ message: 'Error al obtener la asistencia del usuario para el día actual.', error });
  }
};
