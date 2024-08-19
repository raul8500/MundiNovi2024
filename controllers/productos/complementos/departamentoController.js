const Departamento = require('../../../schemas/productosSchema/complementosSchema/departamentoSchema');

// GET: Obtener todos los departamentos
exports.getDepartamentos = async (req, res) => {
    try {
        const departamentos = await Departamento.find();
        res.status(200).json(departamentos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET by ID: Obtener un departamento por ID
exports.getDepartamentoById = async (req, res) => {
    try {
        const departamento = await Departamento.findById(req.params.id);
        if (!departamento) return res.status(404).json({ message: 'Departamento no encontrado' });
        res.status(200).json(departamento);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST: Crear un nuevo departamento
exports.createDepartamento = async (req, res) => {
    const { clave, nombre, descripcion } = req.body;

    const departamento = new Departamento({
        clave,
        nombre,
        descripcion
    });

    try {
        const nuevoDepartamento = await departamento.save();
        res.status(201).json(nuevoDepartamento);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT: Actualizar un departamento existente
exports.updateDepartamento = async (req, res) => {
    try {
        const departamento = await Departamento.findById(req.params.id);
        if (!departamento) return res.status(404).json({ message: 'Departamento no encontrado' });

        departamento.clave = req.body.clave || departamento.clave;
        departamento.nombre = req.body.nombre || departamento.nombre;
        departamento.descripcion = req.body.descripcion || departamento.descripcion;

        const departamentoActualizado = await departamento.save();
        res.status(200).json(departamentoActualizado);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE: Eliminar un departamento
exports.deleteDepartamento = async (req, res) => {
    try {
        const departamento = await Departamento.findById(req.params.id);
        if (!departamento) return res.status(404).json({ message: 'Departamento no encontrado' });

        await departamento.remove();
        res.status(200).json({ message: 'Departamento eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
