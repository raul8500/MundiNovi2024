const MateriaPrima = require('../../schemas/materiasPrimasSchema/materiaPrimaSchema');

// Crear una nueva materia prima
exports.addMateriaPrima = async (req, res) => {
    try {
        const body = req.body;
        const nuevaMateriaPrima = await MateriaPrima.create(body);
        res.status(201).send(nuevaMateriaPrima);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Obtener todas las materias primas
exports.getMateriasPrimas = async (req, res) => {
    try {
        const materiasPrimas = await MateriaPrima.find();
        res.status(200).send(materiasPrimas);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Obtener una materia prima por ID con proveedores poblados, si existen
exports.getMateriaPrimaById = async (req, res) => {
    try {
        const id = req.params.id;
        const materiaPrima = await MateriaPrima.findById(id)
            .populate('proveedores') // Llena los datos del proveedor
            .exec();
        
        if (!materiaPrima) {
            return res.status(404).send('Materia prima no encontrada');
        }

        // Verificar si hay proveedores asociados
        if (materiaPrima.proveedores.length === 0) {
            materiaPrima.proveedores = null;
        }

        res.status(200).json(materiaPrima); // Responder con JSON
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};


// Actualizar una materia prima
exports.updateMateriaPrima = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const materiaPrimaActualizada = await MateriaPrima.findByIdAndUpdate(id, body, { new: true });
        if (!materiaPrimaActualizada) {
            return res.status(404).send('Materia prima no encontrada');
        }
        res.status(200).send(materiaPrimaActualizada);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Eliminar una materia prima
exports.deleteMateriaPrima = async (req, res) => {
    try {
        const id = req.params.id;
        const materiaPrimaEliminada = await MateriaPrima.findByIdAndDelete(id);
        if (!materiaPrimaEliminada) {
            return res.status(404).send('Materia prima no encontrada');
        }
        res.status(200).send('Materia prima eliminada correctamente');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};
