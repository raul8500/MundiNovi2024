const Capacitacion = require('../../schemas/capacitacionSchema/capacitacionSchema');
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

