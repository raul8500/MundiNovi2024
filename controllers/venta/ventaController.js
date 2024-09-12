const Venta = require('../../schemas/venta/ventaSchema');
const Kardex = require('../../schemas/kardexSchema/kardexSchema'); // Asegúrate de ajustar la ruta según tu estructura
const Producto = require('../../schemas/productosSchema/productosSchema'); // Asegúrate de ajustar la ruta según tu estructura
const Client = require('../../schemas/clientesSchema/clientesSchema'); // Ajusta la ruta según tu estructura


exports.getVentasPorSucursalYFechas = async (req, res) => {
  try {
    const { sucursal, fechaInicio, fechaFin } = req.params;

    // Validar fechas
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ error: 'Fecha de inicio y fecha final son requeridas.' });
    }

    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);

    if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
      return res.status(400).json({ error: 'Fecha de inicio o fecha final inválida.' });
    }

    fechaInicioDate.setUTCHours(0);
    fechaFinDate.setUTCHours(23, 59, 59);

    const query = {
      fecha: {
        $gte: fechaInicioDate.toISOString(),
        $lte: fechaFinDate.toISOString(),
      },
      ...(sucursal && { sucursal }),
    };
    

    const ventas = await Venta.find(query)
      .populate('sucursal', 'nombre')
      .sort({ fecha: -1 });

    res.status(200).json({ data: ventas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las ventas.' });
  }
};

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


exports.getVentasDelDia = async (req, res) => {
  try {
    // Obtener la fecha actual (solo día)
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Establecer la hora a 00:00:00 para iniciar el día

    const mañana = new Date(hoy);
    mañana.setDate(hoy.getDate() + 1); // Establecer la fecha límite para el final del día (23:59:59)

    // Buscar todas las ventas realizadas hoy
    const ventas = await Venta.find({
      fecha: { $gte: hoy, $lt: mañana }
    }).populate('sucursal');

    // Inicializar acumuladores
    let totalVentas = 0;
    let totalDinero = 0;
    let totalProductos = 0;
    let sucursalesVentas = {};

    // Procesar las ventas
    ventas.forEach(venta => {
      totalVentas++;
      totalDinero += venta.totalVenta;
      totalProductos += venta.totalProductos;

      // Contabilizar las ventas por sucursal
      const sucursalId = venta.sucursal._id;
      if (!sucursalesVentas[sucursalId]) {
        sucursalesVentas[sucursalId] = {
          nombre: venta.sucursal.nombre,
          totalVentasSucursal: 0,
          totalDineroSucursal: 0
        };
      }
      sucursalesVentas[sucursalId].totalVentasSucursal += venta.totalProductos;
      sucursalesVentas[sucursalId].totalDineroSucursal += venta.totalVenta;
    });

    // Determinar la sucursal que vendió más
    let sucursalTop = null;
    Object.keys(sucursalesVentas).forEach(sucursalId => {
      if (!sucursalTop || sucursalesVentas[sucursalId].totalDineroSucursal > sucursalesVentas[sucursalTop].totalDineroSucursal) {
        sucursalTop = sucursalId;
      }
    });

    // Responder con los datos agregados
    res.status(200).json({
      totalVentas,
      totalDinero,
      totalProductos,
      sucursalQueVendioMas: sucursalTop ? sucursalesVentas[sucursalTop].nombre : null
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las ventas del día' });
  }
};



