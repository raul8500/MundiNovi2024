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

    try {
        // Verificar si la clave ya existe
        const claveExistente = await Grupo.findOne({ clave });
        if (claveExistente) {
            return res.status(400).json({ message: 'La clave ya está en uso' });
        }

        const grupo = new Grupo({
            clave,
            nombre,
            descripcion
        });

        const nuevoGrupo = await grupo.save();
        res.status(201).json(nuevoGrupo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT: Actualizar un grupo existente
exports.updateGrupo = async (req, res) => {
    const { clave, nombre, descripcion } = req.body;

    try {
        const grupo = await Grupo.findById(req.params.id);
        if (!grupo) return res.status(404).json({ message: 'Grupo no encontrado' });

        // Verificar si la nueva clave ya está en uso por otro grupo
        if (clave && clave !== grupo.clave) {
            const claveExistente = await Grupo.findOne({ clave });
            if (claveExistente) {
                return res.status(400).json({ message: 'La clave ya está en uso' });
            }
        }

        // Actualizar los campos del grupo
        grupo.clave = clave || grupo.clave;
        grupo.nombre = nombre || grupo.nombre;
        grupo.descripcion = descripcion || grupo.descripcion;

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
        if (!grupo) {
            return res.status(404).json({ message: 'Grupo no encontrado' });
        }

        await Grupo.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Grupo eliminado correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

