const ZonaCliente = require('../../../schemas/clientesSchema/complementosSchema/zonaClienteSchema');

exports.getZonasClientes = async (req, res) => {
    try {
        const zonasClientes = await ZonaCliente.find();
        res.status(200).json(zonasClientes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las zonas de clientes' });
    }
};

exports.getZonaClienteById = async (req, res) => {
    try {
        const { id } = req.params;

        const zonaCliente = await ZonaCliente.findById(id);

        if (!zonaCliente) {
            return res.status(404).json({ error: 'Zona de cliente no encontrada' });
        }

        res.status(200).json(zonaCliente);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la zona de cliente' });
    }
};

exports.createZonaCliente = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        // Generar clave única
        const clave = `ZC-${Date.now()}`;  // Ejemplo de clave generada, puedes cambiar el formato

        const nuevaZonaCliente = new ZonaCliente({
            clave,
            nombre,
            descripcion
        });

        await nuevaZonaCliente.save();
        res.status(201).json({ message: 'Zona de cliente creada exitosamente', zonaCliente: nuevaZonaCliente });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la zona de cliente' });
    }
};

exports.updateZonaCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        const zonaCliente = await ZonaCliente.findById(id);

        if (!zonaCliente) {
            return res.status(404).json({ error: 'Zona de cliente no encontrada' });
        }

        // Actualizar solo los campos nombre y descripcion
        zonaCliente.nombre = nombre;
        zonaCliente.descripcion = descripcion;

        await zonaCliente.save();
        res.status(200).json({ message: 'Zona de cliente actualizada exitosamente', zonaCliente });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la zona de cliente' });
    }
};

exports.deleteZonaCliente = async (req, res) => {
    try {
        const zonaCliente = await ZonaCliente.findByIdAndDelete(req.params.id);

        if (!zonaCliente) {
            return res.status(404).json({ message: 'Zona de cliente no encontrada' });
        }

        res.status(200).json({ message: 'Zona de cliente eliminada correctamente' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


