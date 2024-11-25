const Capacitacion = require('../../schemas/capacitacionSchema/capacitacionSchema');
const Examen = require('../../schemas/capacitacionSchema/examenSchema');
const Respuesta = require('../../schemas/capacitacionSchema/respuestaSchema');

const path = require('path');
const fs = require('fs');


exports.crearCapacitacion = async (req, res) => {
  try {
    console.log('Cuerpo de la solicitud:', req.body);
    console.log('Archivo recibido:', req.file);

    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ningún archivo.' });
    }

    const rutaPublicaArchivo = `/capacitacion/${req.file.filename}`;
    console.log('Ruta pública del archivo:', rutaPublicaArchivo);

    // Crea el registro en la base de datos
    const nuevaCapacitacion = new Capacitacion({
      tipo: req.body.tipo,
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      archivo: rutaPublicaArchivo,
    });

    const capacitacionGuardada = await nuevaCapacitacion.save();
    res.status(201).json({
      message: 'Capacitación creada con éxito.',
      capacitacion: capacitacionGuardada,
    });
  } catch (error) {
    console.error('Error al crear capacitación:', error);
    res.status(500).json({ message: 'Error al crear capacitación.', error });
  }
};

// Crear Capacitación sin Archivos
exports.crearCapacitacionSinArchivo = async (req, res) => {
  try {
    const { tipo, nombre, descripcion, link } = req.body;

    // Validar el tipo de capacitación
    if (!['pagina', 'video'].includes(tipo)) {
      return res.status(400).json({ message: 'Tipo de capacitación no válido para esta ruta.' });
    }

    // Validar que el link esté presente y sea válido
    if (!link) {
      return res.status(400).json({ message: 'Debe proporcionar un link para este tipo de capacitación.' });
    }

    const urlRegex = /^(https?:\/\/[^\s]+)/;
    if (!urlRegex.test(link)) {
      return res.status(400).json({ message: 'El link proporcionado no es válido.' });
    }

    // Crear el objeto de capacitación
    const nuevaCapacitacion = new Capacitacion({
      tipo,
      nombre,
      descripcion,
      link,
    });

    // Guardar en la base de datos
    const capacitacionGuardada = await nuevaCapacitacion.save();
    res.status(201).json({
      message: 'Capacitación creada con éxito.',
      capacitacion: capacitacionGuardada,
    });
  } catch (error) {
    console.error('Error al crear capacitación:', error);
    res.status(500).json({ message: 'Error al crear capacitación.', error });
  }
};

// Obtener todas las capacitaciones
exports.obtenerCapacitaciones = async (req, res) => {
  try {
    const capacitaciones = await Capacitacion.find();

    if (!capacitaciones.length) {
      return res.status(404).json({ message: 'No se encontraron capacitaciones.' });
    }

    res.status(200).json({
      message: 'Capacitaciones obtenidas con éxito.',
      capacitaciones,
    });
  } catch (error) {
    console.error('Error al obtener capacitaciones:', error);
    res.status(500).json({ message: 'Error al obtener capacitaciones.', error });
  }
};

// Descargar un archivo de capacitación
exports.descargarArchivo = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar la capacitación por ID
    const capacitacion = await Capacitacion.findById(id);

    if (!capacitacion) {
      return res.status(404).json({ message: 'Capacitación no encontrada.' });
    }

    // Verificar si tiene un archivo asociado
    if (!capacitacion.archivo) {
      return res.status(400).json({ message: 'Esta capacitación no tiene un archivo asociado.' });
    }

    // Ruta absoluta del archivo
    const rutaArchivo = path.join(__dirname, '../../public', capacitacion.archivo);

    // Verificar si el archivo existe
    if (!fs.existsSync(rutaArchivo)) {
      return res.status(404).json({ message: 'El archivo no se encontró en el servidor.' });
    }

    // Descargar el archivo
    res.download(rutaArchivo, (err) => {
      if (err) {
        console.error('Error al descargar el archivo:', err);
        res.status(500).json({ message: 'Error al descargar el archivo.' });
      }
    });
  } catch (error) {
    console.error('Error al descargar archivo:', error);
    res.status(500).json({ message: 'Error al descargar archivo.', error });
  }
};

exports.eliminarCapacitacion = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar la capacitación por ID
    const capacitacion = await Capacitacion.findById(id);

    if (!capacitacion) {
      return res.status(404).json({ message: 'Capacitación no encontrada.' });
    }

    // Verificar si tiene un archivo asociado
    if (capacitacion.archivo) {
      // Ruta absoluta del archivo
      const rutaArchivo = path.join(__dirname, '../../public', capacitacion.archivo);

      // Verificar si el archivo existe y eliminarlo
      if (fs.existsSync(rutaArchivo)) {
        fs.unlinkSync(rutaArchivo);
        console.log('Archivo eliminado:', rutaArchivo);
      } else {
        console.warn('El archivo no se encontró en el servidor:', rutaArchivo);
      }
    }

    // Eliminar la capacitación de la base de datos
    await Capacitacion.deleteOne({ _id: id });

    res.status(200).json({ message: 'Capacitación eliminada con éxito.' });
  } catch (error) {
    console.error('Error al eliminar capacitación:', error);
    res.status(500).json({ message: 'Error al eliminar capacitación.', error });
  }
};


//examenes Seccion

// Crear examen
exports.crearExamen = async (req, res) => {
  try {
    const { titulo, descripcion, preguntas, creador, tiposPermitidos } = req.body;

    const nuevoExamen = new Examen({ 
      titulo, 
      descripcion, 
      preguntas, 
      creador, 
      tiposPermitidos 
    });

    await nuevoExamen.save();
    res.status(201).json({ message: 'Examen creado exitosamente', examen: nuevoExamen });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar exámenes
exports.listarExamenes = async (req, res) => {
  try {
    const exámenes = await Examen.find();
    res.status(200).json(exámenes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listarExamenesPorUsuario = async (req, res) => {
  try {
    const { tipoUsuario } = req.params; // Obtener tipo de usuario de los parámetros
    const { usuarioId } = req.params; // Obtener usuarioId de los query params

    // Validar que se envíen los datos necesarios
    if (!tipoUsuario) {
      return res.status(400).json({ message: "El tipo de usuario es requerido." });
    }

    if (!usuarioId) {
      return res.status(400).json({ message: "El usuarioId es requerido." });
    }

    // Filtrar por exámenes activos y permitidos para el tipo de usuario
    const exámenes = await Examen.find({
      activo: true,
      tiposPermitidos: { $in: [parseInt(tipoUsuario)] }
    });

    // Verificar si hay resultados
    if (exámenes.length === 0) {
      return res.status(404).json({ message: "No se encontraron exámenes para este tipo de usuario." });
    }

    // Verificar si el usuario ya respondió cada examen
    const exámenesConEstado = await Promise.all(
      exámenes.map(async (examen) => {
        const respuesta = await Respuesta.findOne({
          examenId: examen._id,
          usuarioId
        });
        return {
          ...examen.toObject(),
          respondido: !!respuesta // true si ya respondió, false si no
        };
      })
    );

    res.status(200).json(exámenesConEstado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Responder examen
exports.responderExamen = async (req, res) => {
  try {
    const { examenId } = req.params;
    const { usuarioId, respuestas } = req.body;

    // Validar campos obligatorios
    if (!examenId || !usuarioId || !respuestas || !Array.isArray(respuestas)) {
      return res.status(400).json({ message: "Datos incompletos: examenId, usuarioId o respuestas son requeridos." });
    }

    // Validar si el usuario ya respondió este examen
    const respuestaExistente = await Respuesta.findOne({ examenId, usuarioId });
    if (respuestaExistente) {
      return res.status(403).json({ message: "El usuario ya respondió este examen." });
    }

    // Validar examen existente
    const examen = await Examen.findById(examenId);
    if (!examen) {
      return res.status(404).json({ message: "Examen no encontrado." });
    }

    // Validar que las respuestas coincidan con el examen
    if (respuestas.length !== examen.preguntas.length) {
      return res.status(400).json({ message: "La cantidad de respuestas no coincide con las preguntas del examen." });
    }

    // Calcular calificación
    let calificacion = 0;
    const respuestasEvaluadas = respuestas.map((respuesta, index) => {
      const correcta = examen.preguntas[index].respuestaCorrecta === respuesta.respuesta;
      if (correcta) calificacion += 1;
      return { ...respuesta, correcta };
    });

    // Crear y guardar la respuesta
    const nuevaRespuesta = new Respuesta({
      examenId,
      usuarioId,
      respuestas: respuestasEvaluadas,
      calificacion: (calificacion / examen.preguntas.length) * 100
    });

    await nuevaRespuesta.save();
    res.status(201).json({ message: 'Respuestas guardadas correctamente.', resultado: nuevaRespuesta });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar respuestas por examen (con usuario populado)
exports.listarRespuestas = async (req, res) => {
  try {
    const { examenId } = req.params; // Usaremos el examenId como parámetro para filtrar

    // Obtener todas las respuestas de un examen, incluyendo datos del usuario
    const respuestas = await Respuesta.find({ examenId })
      .populate('usuarioId'); // Populate para incluir nombre y email del usuario

    if (!respuestas.length) {
      return res.status(404).json({ message: "No se encontraron respuestas para este examen." });
    }

    res.status(200).json(respuestas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cambiarEstadoExamen = async (req, res) => {
  try {
    const { examenId } = req.params;
    const { activo } = req.body;

    const examen = await Examen.findByIdAndUpdate(
      examenId,
      { activo },
      { new: true }
    );

    if (!examen) return res.status(404).json({ message: 'Examen no encontrado' });

    res.status(200).json({ message: `Examen ${activo ? 'activado' : 'desactivado'}`, examen });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
