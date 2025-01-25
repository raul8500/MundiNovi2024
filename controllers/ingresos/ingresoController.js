// controllers/ingresoController.js
const Ingreso = require('../../schemas/ingresosSchema/ingresosSchema');


// Crear un nuevo ingreso
exports.crearIngreso = async (req, res) => {
  try {
    const { sucursal, tipoIngreso, importe, usuario, fecha, observaciones } = req.body;

    if (!sucursal || !tipoIngreso || !importe || !usuario || !fecha) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    // Generar el próximo folio automáticamente
    const ultimoIngreso = await Ingreso.findOne().sort({ createdAt: -1 }); // Obtener el más reciente
    const ultimoFolio = ultimoIngreso ? parseInt(ultimoIngreso.folio.replace('IG-', ''), 10) : 999;
    const nuevoFolio = `IG-${ultimoFolio + 1}`;

    const nuevoIngreso = new Ingreso({
      sucursal,
      folio: nuevoFolio,
      tipoIngreso,
      importe,
      usuario,
      fecha,
      observaciones,
    });

    await nuevoIngreso.save();
    res.status(201).json({ message: 'Ingreso creado', data: nuevoIngreso });
  } catch (error) {
    console.error('Error al crear ingreso:', error); // Log para depuración
    res.status(500).json({ message: 'Error al crear ingreso', error: error.message });
  }
};



// Obtener todos los ingresos
exports.obtenerIngresos = async (req, res) => {
  try {
    const ingresos = await Ingreso.find()
      .populate('sucursal') // Cambia "nombre" por las propiedades que necesites de Sucursal
      .populate('tipoIngreso') // Cambia "nombre" por las propiedades que necesites de TipoIngreso
      .populate('usuario'); // Cambia "nombre" por las propiedades que necesites de Usuario
    res.status(200).json({ data: ingresos });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ingresos', error: error.message });
  }
};

// Obtener un ingreso por ID
exports.obtenerIngresoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const ingreso = await Ingreso.findById(id)
      .populate('sucursal')
      .populate('tipoIngreso')
      .populate('usuario');
    if (!ingreso) {
      return res.status(404).json({ message: 'Ingreso no encontrado' });
    }
    res.status(200).json({ data: ingreso });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ingreso', error: error.message });
  }
};

// Actualizar un ingreso
exports.actualizarIngreso = async (req, res) => {
  try {
    const { id } = req.params;
    const { sucursal, folio, tipoIngreso, importe, usuario, fecha, observaciones } = req.body;

    // Validar si se envían todos los campos necesarios
    if (!sucursal || !tipoIngreso || !importe || !usuario || !fecha) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    // Actualizar ingreso
    const ingresoActualizado = await Ingreso.findByIdAndUpdate(
      id,
      { sucursal, folio, tipoIngreso, importe, usuario, fecha, observaciones },
      { new: true, runValidators: true } // Habilitar validación
    );

    // Verificar si el ingreso existe
    if (!ingresoActualizado) {
      return res.status(404).json({ message: 'Ingreso no encontrado.' });
    }

    res.status(200).json({ message: 'Ingreso actualizado', data: ingresoActualizado });
  } catch (error) {
    console.error('Error al actualizar ingreso:', error); // Log para depuración
    res.status(500).json({ message: 'Error al actualizar ingreso', error: error.message });
  }
};


// Eliminar un ingreso
exports.eliminarIngreso = async (req, res) => {
  try {
    const { id } = req.params;
    const ingresoEliminado = await Ingreso.findByIdAndDelete(id);
    if (!ingresoEliminado) {
      return res.status(404).json({ message: 'Ingreso no encontrado' });
    }
    res.status(200).json({ message: 'Ingreso eliminado', data: ingresoEliminado });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar ingreso', error: error.message });
  }
};
