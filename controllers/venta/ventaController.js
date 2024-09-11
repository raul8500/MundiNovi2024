const Venta = require('../../schemas/venta/ventaSchema');
const Kardex = require('../../schemas/kardexSchema/kardexSchema'); // Asegúrate de ajustar la ruta según tu estructura
const Producto = require('../../schemas/productosSchema/productosSchema'); // Asegúrate de ajustar la ruta según tu estructura

// Función para generar un folio único de 7 dígitos
const generateFolio = () => {
    return String(Math.floor(1000000 + Math.random() * 9000000)); // Genera un número aleatorio de 7 dígitos
};


exports.createVenta = async (req, res) => {
    try {
        console.log("Request body:", req.body); // Imprime el cuerpo completo de la solicitud

        const sucursal = req.body.venta.sucursalId;
        const productos = req.body.venta.productos;
        const tipoVenta = req.body.resumenVenta.esFactura;
        const cliente = req.body.resumenVenta.cliente ? req.body.resumenVenta.cliente._id : null;
        const totalAPagar = req.body.venta.totalVenta;

        // Inicializar totalVenta y totalProductos
        let totalVenta = 0;
        let totalProductos = 0;

        // Procesar cada producto en la venta
        for (const producto of productos) {
            const { _id, cantidad, precio } = producto;

            try {
                // Buscar el producto
                const productoEncontrado = await Producto.findById(_id);
                if (!productoEncontrado) {
                    console.error("Producto no encontrado:", _id);
                    return res.status(404).json({ error: 'Producto no encontrado' });
                }

                // Calcular el total del producto
                const totalProducto = cantidad * precio;
                totalVenta += totalProducto;
                totalProductos += cantidad;

                try {
                    // Buscar el último registro del Kardex para el producto
                    const ultimoKardex = await Kardex.findOne({ reference: productoEncontrado.reference }).sort({ fecha: -1 });

                    // Calcular la nueva existencia
                    let nuevaExistencia;
                    if (ultimoKardex) {
                        nuevaExistencia = ultimoKardex.existencia - cantidad;
                    } else {
                        nuevaExistencia = -cantidad;
                    }

                    // Crear el registro en Kardex
                    const folio = generateFolio();
                    await Kardex.create({
                        fecha: new Date(),
                        folio,
                        usuario: req.body.infoUser._id, // Suponiendo que el usuario está en req.user
                        movimiento: 'Venta',
                        sucursal,
                        reference: productoEncontrado.reference,
                        nombre: productoEncontrado.name,
                        cantidad: -cantidad,
                        costoUnitario: precio,
                        existencia: nuevaExistencia
                    });
                } catch (kardexError) {
                    console.error("Error al crear el registro en Kardex:", kardexError);
                    return res.status(500).json({ error: 'Error al crear el registro en Kardex' });
                }

                // Actualizar la existencia del producto
                try {
                    const nuevaExistencia = productoEncontrado.controlAlmacen - cantidad;
                    await Producto.updateOne(
                        { _id },
                        { $set: { controlAlmacen: nuevaExistencia } }
                    );
                } catch (updateError) {
                    console.error("Error al actualizar el inventario del producto:", updateError);
                    return res.status(500).json({ error: 'Error al actualizar el inventario del producto' });
                }
            } catch (productoError) {
                console.error("Error al procesar el producto:", productoError);
                return res.status(500).json({ error: 'Error al procesar el producto' });
            }
        }

        try {
            // Crear la venta
            const nuevaVenta = new Venta({
                noVenta: generateFolio(), // Asignar un folio único para la venta
                sucursal,
                tipoVenta,
                cliente, // Manejar cliente nulo o vacío
                totalVenta,
                totalProductos,
                productos
            });

            // Guardar la venta
            const ventaGuardada = await nuevaVenta.save();
            console.log("Venta guardada correctamente:", ventaGuardada);

            res.status(201).json({ message: 'Venta creada correctamente', data: ventaGuardada });
        } catch (ventaError) {
            console.error("Error al crear la venta:", ventaError);
            res.status(500).json({ error: 'Error al crear la venta' });
        }
    } catch (error) {
        console.error("Error general en la creación de la venta:", error);
        res.status(500).json({ error: 'Error general en la creación de la venta' });
    }
};


