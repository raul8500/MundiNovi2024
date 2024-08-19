const Grupo = require('../../../schemas/productosSchema/complementosSchema/grupoSchema');

// GET: Obtener todos los grupos
exports.getGrupos = async (req, res) => {
    try {
        const grupos = await Grupo.find();
        res.status(200).json(grupos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET by ID: Obtener un grupo por ID
exports.getGrupoById = async (req, res) => {
    try {
        const grupo = await Grupo.findById(req.params.id);
        if (!grupo) return res.status(404).json({ message: 'Grupo no encontrado' });
        res.status(200).json(grupo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST: Crear un nuevo grupo
exports.createGrupo = async (req, res) => {
    const { clave, nombre, descripcion } = req.body;

    const grupo = new Grupo({
        clave,
        nombre,
        descripcion
    });

    try {
        const nuevoGrupo = await grupo.save();
        res.status(201).json(nuevoGrupo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT: Actualizar un grupo existente
exports.updateGrupo = async (req, res) => {
    try {
        const grupo = await Grupo.findById(req.params.id);
        if (!grupo) return res.status(404).json({ message: 'Grupo no encontrado' });

        grupo.clave = req.body.clave || grupo.clave;
        grupo.nombre = req.body.nombre || grupo.nombre;
        grupo.descripcion = req.body.descripcion || grupo.descripcion;

        const grupoActualizado = await grupo.save();
        res.status(200).json(grupoActualizado);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE: Eliminar un grupo
exports.deleteGrupo = async (req, res) => {
    try {
        const grupo = await Grupo.findById(req.params.id);
        if (!grupo) return res.status(404).json({ message: 'Grupo no encontrado' });

        await grupo.remove();
        res.status(200).json({ message: 'Grupo eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
