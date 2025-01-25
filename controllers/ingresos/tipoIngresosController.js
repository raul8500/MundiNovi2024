// controllers/tipoIngresoController.js
const TipoIngreso = require('../../schemas/ingresosSchema/ingresosTipoSchema');

// Crear un nuevo tipo de ingreso
exports.crearTipoIngreso = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const nuevoTipoIngreso = new TipoIngreso({ nombre, descripcion });
    await nuevoTipoIngreso.save();
    res.status(201).json({ message: 'Tipo de ingreso creado', data: nuevoTipoIngreso });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear tipo de ingreso', error: error.message });
  }
};

// Obtener todos los tipos de ingreso
exports.obtenerTiposIngreso = async (req, res) => {
  try {
    const tiposIngreso = await TipoIngreso.find();
    res.status(200).json({ data: tiposIngreso });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tipos de ingreso', error: error.message });
  }
};

// Obtener un tipo de ingreso por ID
// Obtener un tipo de ingreso por ID
exports.obtenerTipoIngresoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const tipoIngreso = await TipoIngreso.findById(id);
    if (!tipoIngreso) {
      return res.status(404).json({ message: 'Tipo de ingreso no encontrado' });
    }
    res.status(200).json({ data: tipoIngreso }); // Asegúrate de que se devuelve en "data"
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tipo de ingreso', error: error.message });
  }
};



// Actualizar un tipo de ingreso
// Actualizar un tipo de ingreso
exports.actualizarTipoIngreso = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    const tipoIngresoActualizado = await TipoIngreso.findByIdAndUpdate(
      id,
      { nombre, descripcion },
      { new: true } // Devuelve el documento actualizado
    );
    if (!tipoIngresoActualizado) {
      return res.status(404).json({ message: 'Tipo de ingreso no encontrado' });
    }
    res.status(200).json({ message: 'Tipo de ingreso actualizado', data: tipoIngresoActualizado });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar tipo de ingreso', error: error.message });
  }
};


// Eliminar un tipo de ingreso
exports.eliminarTipoIngreso = async (req, res) => {
  try {
    const { id } = req.params;
    const tipoIngresoEliminado = await TipoIngreso.findByIdAndDelete(id);
    if (!tipoIngresoEliminado) {
      return res.status(404).json({ message: 'Tipo de ingreso no encontrado' });
    }
    res.status(200).json({ message: 'Tipo de ingreso eliminado', data: tipoIngresoEliminado });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar tipo de ingreso', error: error.message });
  }
};
