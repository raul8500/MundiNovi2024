const Arqueo = require('../../../schemas/arqueo/efectivo/arqueoEfectivoSchema'); // Modelo de Arqueo
const Venta = require('../../../schemas/venta/ventaSchema'); // Modelo de Venta

// Controlador para crear un arqueo
exports.crearArqueo = async (req, res) => {
    const { sucursal, efectivoEnCaja, userId } = req.body;

    if (!sucursal || typeof efectivoEnCaja !== 'number') {
        return res.status(400).json({ error: 'Sucursal y efectivo en caja son obligatorios.' });
    }

    try {
        // Fecha actual en formato ISO
        const inicioDia = new Date();
        inicioDia.setHours(0, 0, 0, 0); // Inicio del día
        const finDia = new Date();
        finDia.setHours(23, 59, 59, 999); // Fin del día

        // Calcular total de ventas en efectivo del día actual para la sucursal
        const ventas = await Venta.find({
            sucursal,
            fecha: { $gte: inicioDia, $lte: finDia }
        });

        const totalVentasEfectivo = ventas.reduce((total, venta) => {
            const efectivo = venta.formasDePago
                .filter(pago => pago.tipo === 'cash') // Solo ventas en efectivo
                .reduce((suma, pago) => suma + pago.importe - (pago.cambio || 0), 0); // Total efectivo menos cambio
            return total + efectivo;
        }, 0);

        // Calcular diferencia
        const diferencia = efectivoEnCaja - totalVentasEfectivo;

        // Crear el nuevo registro de arqueo
        const nuevoArqueo = new Arqueo({
            sucursal,
            usuario: userId,
            totalVentasEfectivo,
            efectivoEnCaja,
            diferencia
        });

        // Guardar en la base de datos
        const arqueoGuardado = await nuevoArqueo.save();

        res.status(201).json({
            message: 'Arqueo creado exitosamente.',
            arqueo: arqueoGuardado
        });
    } catch (error) {
        console.error('Error al crear el arqueo:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// Controlador para obtener todos los arqueos
exports.getAllArqueos = async (req, res) => {
    try {
        const arqueos = await Arqueo.find()
            .populate('sucursal', 'nombre') // Obtén solo el nombre de la sucursal
            .populate('usuario') // Obtén nombre y correo del usuario
            .sort({ createdAt: -1 }); // Ordenar por fecha de creación descendente

        res.status(200).json(arqueos);
    } catch (error) {
        console.error('Error al obtener los arqueos:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// Controlador para obtener un arqueo por ID
exports.getArqueoById = async (req, res) => {
    const { id } = req.params;

    try {
        const arqueo = await Arqueo.findById(id)
            .populate('sucursal', 'nombre') // Obtén solo el nombre de la sucursal
            .populate('usuario'); // Obtén nombre y correo del usuario

        if (!arqueo) {
            return res.status(404).json({ error: 'Arqueo no encontrado.' });
        }

        res.status(200).json(arqueo);
    } catch (error) {
        console.error('Error al obtener el arqueo:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// Controlador para eliminar un arqueo por ID
exports.deleteArqueo = async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar si el arqueo existe
        const arqueo = await Arqueo.findById(id);

        if (!arqueo) {
            return res.status(404).json({ error: 'Arqueo no encontrado.' });
        }

        // Eliminar el registro de la base de datos
        await Arqueo.findByIdAndDelete(id);

        res.status(200).json({ message: 'Arqueo eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar el arqueo:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};