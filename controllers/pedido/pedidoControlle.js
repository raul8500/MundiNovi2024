const Pedido = require('../../schemas/pedidosSchema/pedidosSchema');
const Cotizacion = require('../../schemas/cotizacionesSchema/cotizacionesSchema');


exports.crearPedido = async (req, res) => {
    try {
        const { cotizacionId, cliente, factura, entrega, productos } = req.body;

        // Calcular el total sumando los totales de cada producto
        const total = productos.reduce((acc, producto) => acc + (producto.total || 0), 0);

        // Crear el nuevo pedido
        const nuevoPedido = new Pedido({
            cotizacionId,
            cliente,
            factura,
            entrega,
            productos,
            total // Aquí agregamos el total calculado
        });

        // Guardar el pedido en la base de datos
        await nuevoPedido.save();

        // Eliminar la cotización después de guardar el pedido
        await Cotizacion.findByIdAndDelete(cotizacionId);

        res.status(201).json({
            success: true,
            message: 'Pedido creado exitosamente y cotización eliminada.',
            data: nuevoPedido
        });
    } catch (error) {
        console.error('❌ Error al crear el pedido:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear el pedido.',
            error: error.message
        });
    }
};

/**
 * Obtener todos los pedidos con los datos del cliente y usuario que los creó.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
exports.getAllPedidos = async (req, res) => {
    try {
        // Buscar todos los pedidos y poblar datos de cliente y usuario
        const pedidos = await Pedido.find()
            .populate('cliente.idCliente') // Poblar datos clave del cliente
            .populate('entrega.sucursal.id') // Poblar datos clave del cliente
            .populate('productos.id') // Poblar datos clave del cliente


            .sort({ createdAt: -1 }); // Ordenar por fecha de creación descendente

        res.status(200).json(pedidos);
    } catch (error) {
        console.error('❌ Error al obtener los pedidos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener los pedidos.',
            error: error.message,
        });
    }
};

/**
 * Obtener pedidos filtrados por sucursal y fecha de entrega.
 * @route GET /api/pedidos/filtrar/:sucursalId/:fechaEntrega
 * @param {string} sucursalId - ID de la sucursal.
 * @param {string} fechaEntrega - Fecha de entrega en formato AAAA-MM-DD.
 */
exports.getPedidosPorSucursalYFecha = async (req, res) => {
    try {
        const { sucursalId, fechaEntrega } = req.params;

        // Validar parámetros obligatorios
        if (!sucursalId || !fechaEntrega) {
            return res.status(400).json({
                success: false,
                message: 'Sucursal y fecha de entrega son obligatorios.'
            });
        }

        // Buscar pedidos que coincidan con los filtros
        const pedidos = await Pedido.find({
            'entrega.sucursal.id': sucursalId,
            'entrega.fecha': fechaEntrega
        })
        .populate('cliente.idCliente')
        .populate('productos.id') // Poblamos los productos si es necesario

        // Responder con los pedidos encontrados
        res.status(200).json({
            success: true,
            data: pedidos
        });
    } catch (error) {
        console.error('❌ Error al obtener los pedidos filtrados:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor.'
        });
    }
};
