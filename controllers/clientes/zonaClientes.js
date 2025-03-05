const ZonaCliente = require('../../schemas/clientesSchema/complementosSchema/zonaClienteSchema');

// Crear una nueva zona de cliente
exports.createZonaCliente = async (req, res) => {
    try {
        const nuevaZona = new ZonaCliente(req.body);
        await nuevaZona.save();
        res.status(201).json(nuevaZona);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todas las zonas de clientes
exports.getZonasClientes = async (req, res) => {
    try {
        const zonas = await ZonaCliente.find();
        res.json(zonas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener una zona de cliente por ID
exports.getZonaClienteById = async (req, res) => {
    try {
        const zona = await ZonaCliente.findById(req.params.id);
        if (!zona) {
            return res.status(404).json({ message: 'Zona de cliente no encontrada' });
        }
        res.json(zona);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar una zona de cliente por ID
exports.updateZonaCliente = async (req, res) => {
    try {
        const zonaActualizada = await ZonaCliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!zonaActualizada) {
            return res.status(404).json({ message: 'Zona de cliente no encontrada' });
        }
        res.json(zonaActualizada);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar una zona de cliente por ID
exports.deleteZonaCliente = async (req, res) => {
    try {
        const zonaEliminada = await ZonaCliente.findByIdAndDelete(req.params.id);
        if (!zonaEliminada) {
            return res.status(404).json({ message: 'Zona de cliente no encontrada' });
        }
        res.json({ message: 'Zona de cliente eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
