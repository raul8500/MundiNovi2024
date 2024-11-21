const Capacitacion = require('../../schemas/capacitacionSchema/capacitacionSchema');
const path = require('path');

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

