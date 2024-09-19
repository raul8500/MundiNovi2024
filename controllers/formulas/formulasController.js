const FormulaProduccion = require('../../schemas/formulasSchema/formulasSchema');

// Crear una nueva fórmula de producción
exports.addFormulaProduccion = async (req, res) => {
    try {
        const body = req.body;
        const nuevaFormula = await FormulaProduccion.create(body);
        res.status(201).send(nuevaFormula);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Obtener todas las fórmulas de producción
exports.getFormulasProduccion = async (req, res) => {
    try {
        const formulas = await FormulaProduccion.find().populate('productoFinal').populate('materiasPrimas._id');
        res.status(200).send(formulas);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Obtener una fórmula de producción por ID
exports.getFormulaProduccionById = async (req, res) => {
    try {
        const { id } = req.params;
        const formula = await FormulaProduccion.findById(id).populate('productoFinal').populate('materiasPrimas._id');
        if (!formula) {
            return res.status(404).send('Fórmula de producción no encontrada');
        }
        res.status(200).send(formula);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Actualizar una fórmula de producción por ID
exports.updateFormulaProduccion = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const formulaActualizada = await FormulaProduccion.findByIdAndUpdate(id, body, { new: true }).populate('productoFinal').populate('materiasPrimas._id');
        if (!formulaActualizada) {
            return res.status(404).send('Fórmula de producción no encontrada');
        }
        res.status(200).send(formulaActualizada);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Eliminar una fórmula de producción por ID
exports.deleteFormulaProduccion = async (req, res) => {
    try {
        const { id } = req.params;
        const formulaEliminada = await FormulaProduccion.findByIdAndDelete(id);
        if (!formulaEliminada) {
            return res.status(404).send('Fórmula de producción no encontrada');
        }
        res.status(200).send('Fórmula de producción eliminada');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};
