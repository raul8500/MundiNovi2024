const Franquicia = require('../../schemas/franquiciaSchema/franquiciaSchema');

// Crear una nueva franquicia
exports.addFranquicia = async (req, res) => {
    try {
        const body = req.body;
        const nuevaFranquicia = await Franquicia.create(body);
        res.status(201).send(nuevaFranquicia);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Obtener todas las franquicias
exports.getFranquicias = async (req, res) => {
    try {
        const franquicias = await Franquicia.find();
        if (!franquicias.length) {
            return res.status(404).send('No se encontraron franquicias');
        }
        res.send(franquicias);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Obtener una franquicia individual
exports.getIndividualFranquicia = async (req, res) => {
    try {
        const { id } = req.params;
        const franquicia = await Franquicia.findById(id);

        if (!franquicia) {
            return res.status(404).send('Franquicia no encontrada');
        }
        res.send(franquicia);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};


// Eliminar una franquicia
exports.deleteFranquicia = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID del parámetro de la solicitud
        const franquicia = await Franquicia.findByIdAndDelete(id);

        if (!franquicia) {
            return res.status(404).send('Franquicia no encontrada');
        }
        res.send('Franquicia eliminada exitosamente');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Editar una franquicia
exports.editFranquicia = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID del parámetro de la solicitud
        const body = req.body; // Obtener los datos del cuerpo de la solicitud

        // Buscar y actualizar la franquicia por ID
        const franquiciaActualizada = await Franquicia.findByIdAndUpdate(id, body, { new: true, runValidators: true });

        if (!franquiciaActualizada) {
            return res.status(404).send('Franquicia no encontrada');
        }
        res.send(franquiciaActualizada);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

