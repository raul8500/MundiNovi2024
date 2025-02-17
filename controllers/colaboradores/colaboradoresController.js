const Colaborador = require('../../schemas/colaboradoresSchema/colaboradoresSchema');

// Obtener todos los colaboradores
exports.getAllColaboradoresFromBD = async (req, res) => {
  try {
    const colaboradores = await Colaborador.find()
      .populate('datos_empresa.sucursales')
      .populate('datos_empresa.usuario_sistema');

    if (!colaboradores || colaboradores.length === 0) {
      return res.status(404).json({ message: 'No se encontraron colaboradores.' });
    }

    res.status(200).json(colaboradores);
  } catch (error) {
    console.error('Error al obtener los colaboradores:', error);
    res.status(500).json({ message: 'Error al obtener los colaboradores.', error });
  }
};

// Obtener colaborador por ID
exports.getColaboradorByIdFromBD = async (req, res) => {
  try {
    const { id } = req.params;
    const colaborador = await Colaborador.findById(id)
    .populate('datos_empresa.sucursales')
    .populate('datos_empresa.usuario_sistema');

    if (!colaborador) {
      return res.status(404).json({ message: 'Colaborador no encontrado.' });
    }

    res.status(200).json(colaborador);
  } catch (error) {
    console.error('Error al obtener el colaborador:', error);
    res.status(500).json({ message: 'Error al obtener el colaborador.', error });
  }
};

// Crear un nuevo colaborador
exports.createColaborador = async (req, res) => {
    try {
        const nuevoColaborador = new Colaborador(req.body);
        const colaboradorGuardado = await nuevoColaborador.save();

        res.status(201).json(colaboradorGuardado);
    } catch (error) {
        console.error('Error al crear el colaborador:', error);
        res.status(500).json({ message: 'Error al crear el colaborador.', error });
    }
};

// Actualizar colaborador por ID
exports.updateColaborador = async (req, res) => {
    try {
        const { id } = req.params;
        const colaboradorActualizado = await Colaborador.findByIdAndUpdate(id, req.body, { new: true });

        if (!colaboradorActualizado) {
            return res.status(404).json({ message: 'Colaborador no encontrado.' });
        }

        res.status(200).json(colaboradorActualizado);
    } catch (error) {
        console.error('Error al actualizar el colaborador:', error);
        res.status(500).json({ message: 'Error al actualizar el colaborador.', error });
    }
};

// Eliminar colaborador por ID
exports.deleteColaboradorFromBD = async (req, res) => {
  try {
    const { id } = req.params;
    const colaboradorEliminado = await Colaborador.findByIdAndDelete(id);

    if (!colaboradorEliminado) {
      return res.status(404).json({ message: 'Colaborador no encontrado.' });
    }

    res.status(200).json({ message: 'Colaborador eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar el colaborador:', error);
    res.status(500).json({ message: 'Error al eliminar el colaborador.', error });
  }
};
