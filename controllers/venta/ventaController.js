const Venta = require('../../schemas/venta/ventaSchema');
const Kardex = require('../../schemas/kardexSchema/kardexSchema'); // Asegúrate de ajustar la ruta según tu estructura
const Producto = require('../../schemas/productosSchema/productosSchema');
const Client = require('../../schemas/clientesSchema/clientesSchema');
const CorteGeneral = require('../../schemas/cortes/cortesFinalesSchema');
const CorteFinal = require('../../schemas/cortes/cortesFinalesSchema');

const mongoose = require('mongoose');

exports.getVentasPorSucursalYFechas = async (req, res) => {
  try {
    const { sucursal, fechaInicio, fechaFin } = req.params;

    if (!fechaInicio || !fechaFin) {
      return res
        .status(400)
        .json({ error: 'Fecha de inicio y fecha final son requeridas.' });
    }

    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);

    if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
      return res
        .status(400)
        .json({ error: 'Fecha de inicio o fecha final inválida.' });
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
      .populate('productos.productoId')
      .sort({ fecha: -1 });

    console.log(ventas);
    res.status(200).json({ data: ventas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las ventas.' });
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
      fecha: { $gte: hoy, $lt: mañana },
    }).populate('sucursal');

    // Inicializar acumuladores
    let totalVentas = 0;
    let totalDinero = 0;
    let totalProductos = 0;
    let sucursalesVentas = {};

    // Procesar las ventas
    ventas.forEach((venta) => {
      totalVentas++;
      totalDinero += venta.totalVenta;
      totalProductos += venta.totalProductos;

      // Contabilizar las ventas por sucursal
      const sucursalId = venta.sucursal._id;
      if (!sucursalesVentas[sucursalId]) {
        sucursalesVentas[sucursalId] = {
          nombre: venta.sucursal.nombre,
          totalVentasSucursal: 0,
          totalDineroSucursal: 0,
        };
      }
      sucursalesVentas[sucursalId].totalVentasSucursal += venta.totalProductos;
      sucursalesVentas[sucursalId].totalDineroSucursal += venta.totalVenta;
    });

    // Determinar la sucursal que vendió más
    let sucursalTop = null;
    Object.keys(sucursalesVentas).forEach((sucursalId) => {
      if (
        !sucursalTop ||
        sucursalesVentas[sucursalId].totalDineroSucursal >
          sucursalesVentas[sucursalTop].totalDineroSucursal
      ) {
        sucursalTop = sucursalId;
      }
    });

    // Responder con los datos agregados
    res.status(200).json({
      totalVentas,
      totalDinero,
      totalProductos,
      sucursalQueVendioMas: sucursalTop
        ? sucursalesVentas[sucursalTop].nombre
        : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las ventas del día' });
  }
};

exports.getVentaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el id es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID inválido.' });
    }

    // Buscar la venta por su _id
    const venta = await Venta.findById(id)
      .populate('sucursal', 'nombre') // Ajusta según los campos que necesites
      .populate({
        path: 'productos',
      })
      .exec();

    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada.' });
    }

    res.status(200).json({ data: venta });
  } catch (error) {
    console.error('Error al obtener la venta:', error);
    res.status(500).json({ error: 'Error al obtener la venta.' });
  }
};

exports.createVenta = async (req, res) => {
    let vendedor = req.body.venta.usuario._id;
    const sucursal = req.body.venta.sucursalId;

    try {
        let corteFolio = '';
        
        // Verificar si hay un corte pendiente
        const cortePendiente = await checkCorteUsuarioIniciadoONoFinalizado(vendedor);

        if (cortePendiente) {
            corteFolio = cortePendiente;
        } else {
            // Crear un nuevo corte si no existe
            corteFolio = await crearCorteFinal(vendedor, sucursal);
        }

        // Verificar si es necesario hacer un corte parcial
        const resultado = await checkCorteUsuarioIniciadoConVentas(vendedor);

        if (resultado.codigo == 1) {
            return res.status(304).json({
                message: 'Es necesario realizar un corte parcial antes de proceder con la venta.',
                totalEfectivo: resultado.totalVentasEfectivo
            });
        } else if (resultado.codigo == 0) {
            console.log('No es necesario un corte parcial. Continuar con la venta.');
        } else if (resultado.codigo == -1) {
            return res.status(404).json({
                message: 'No se encontró un corte pendiente.'
            });
        }

        // Continuar con la creación de la venta

        const productos = req.body.venta.productos;
        const tipoVenta = req.body.resumenVenta.esFactura;
        const cliente = req.body.resumenVenta.cliente
            ? req.body.resumenVenta.cliente._id
            : null;
        const totalAPagar = req.body.venta.totalVenta;
        const formasDePago = req.body.resumenVenta.formasDePago;

        let totalVenta = 0;
        let totalProductos = 0;

        // Array para almacenar los productos con referencia a Kardex
        const productosConKardex = [];

        for (const producto of productos) {
            const { _id, cantidad, precio } = producto;

            try {
                const productoEncontrado = await Producto.findById(_id);
                if (!productoEncontrado) {
                    console.error('Producto no encontrado:', _id);
                    return res.status(404).json({ error: 'Producto no encontrado' });
                }

                const totalProducto = cantidad * precio;
                totalVenta += totalProducto;
                totalProductos += cantidad;

                try {
                    const ultimoKardex = await Kardex.findOne({
                        reference: productoEncontrado.reference,
                    }).sort({ fecha: -1 });

                    let nuevaExistencia;
                    if (ultimoKardex) {
                        nuevaExistencia = ultimoKardex.existencia - cantidad;
                    } else {
                        nuevaExistencia = -cantidad;
                    }

                    // Generar el folio y crear el registro en Kardex
                    const folio = generateFolio();
                    const nuevoKardex = await Kardex.create({
                        fecha: new Date(),
                        folio,
                        usuario: req.body.infoUser._id,
                        movimiento: 'Venta',
                        sucursal,
                        reference: productoEncontrado.reference,
                        nombre: productoEncontrado.name,
                        cantidad: -cantidad,
                        costoUnitario: precio,
                        existencia: nuevaExistencia,
                    });

                    // Actualizar la existencia del producto
                    await Producto.updateOne(
                        { _id },
                        { $set: { controlAlmacen: nuevaExistencia } },
                    );

                    // Guardar el folio y el ID del Kardex
                    productosConKardex.push({
                        nombre: productoEncontrado.name,
                        productoId: _id,
                        cantidad,
                        precio,
                        kardexId: nuevoKardex._id,
                        kardexFolio: folio,
                    });
                } catch (kardexError) {
                    console.error('Error al crear el registro en Kardex:', kardexError);
                    return res.status(500).json({ error: 'Error al crear el registro en Kardex' });
                }
            } catch (productoError) {
                console.error('Error al procesar el producto:', productoError);
                return res.status(500).json({ error: 'Error al procesar el producto' });
            }
        }

        try {
            // Crear la venta con los productos
            const nuevaVenta = new Venta({
                noVenta: generateFolio(),
                sucursal,
                tipoVenta,
                cliente,
                totalVenta,
                totalProductos,
                productos: productosConKardex,
                formasDePago,
            });

            const ventaGuardada = await nuevaVenta.save();

            // Buscar el corte y actualizarlo con la nueva venta
            const corteFinal = await CorteFinal.findOne({ folio: corteFolio });

            let totalEfectivoVenta = 0;
            let totalTarjetas = 0;
            let totalTransferencias = 0;
            let montoTransferencias = 0;

            ventaGuardada.formasDePago.forEach(forma => {
                if (forma.tipo === 'efectivo') {
                    totalEfectivoVenta += forma.importe - forma.cambio;
                } else if (forma.tipo === 'tarjeta credito') {
                    corteFinal.T_credito = (corteFinal.T_credito || 0) + forma.importe;
                    totalTarjetas += forma.importe;
                } else if (forma.tipo === 'tarjeta debito') {
                    corteFinal.T_debito = (corteFinal.T_debito || 0) + forma.importe;
                    totalTarjetas += forma.importe;
                } else if (forma.tipo === 'transferencia') {
                    corteFinal.transferencias = true;
                    montoTransferencias += forma.importe;
                }
            });

            // Actualizar total de tarjetas y transferencias
            corteFinal.total_tarjetas = (corteFinal.total_tarjetas || 0) + totalTarjetas;
            corteFinal.monto_transferencias = (corteFinal.monto_transferencias || 0) + montoTransferencias;

            // Agregar la venta al arreglo de ventas del corte final
            corteFinal.ventas.push({
                venta: ventaGuardada._id,
                contada: false,
            });

            // Si hubo pagos en efectivo, sumarlos al totalVentasEfectivoCortes
            if (totalEfectivoVenta > 0) {
                corteFinal.totalVentasEfectivoCortes = (corteFinal.totalVentasEfectivoCortes || 0) + totalEfectivoVenta;
            }

            await corteFinal.save();

            res.status(201).json({ message: 'Venta creada correctamente', data: ventaGuardada });
        } catch (ventaError) {
            console.error('Error al crear la venta:', ventaError);
            res.status(500).json({ error: 'Error al crear la venta' });
        }
    } catch (error) {
        console.error('Error general en la creación de la venta:', error);
        res.status(500).json({ error: 'Error general en la creación de la venta' });
    }
};

const generateFolio = () => {
  return String(Math.floor(1000000 + Math.random() * 9000000)); // Genera un número aleatorio de 7 dígitos
};

async function checkCorteUsuarioIniciadoONoFinalizado(userId) {
    try {
        const corte = await CorteGeneral.findOne({
            usuario: userId,
            $or: [
                { fecha_inicial: { $exists: true } }, // Verifica si tiene un corte iniciado
                { fecha_final: { $exists: false } }    // Verifica si no está finalizado
            ]
        });

        // Si existe un corte iniciado o no finalizado, retorna el folio
        if (corte) {
            return corte.folio; // Devolver el folio del corte
        }

        // Si no hay corte iniciado ni pendiente, retorna null o false
        return null;
    } catch (error) {
        console.log('Error al buscar corte:', error);
        throw new Error('Error interno del servidor');
    }
}

async function crearCorteFinal(usuario, sucursal) {
    try {
        const folioUnico = await generarFolioPadreUnico();
        const nuevoCorteFinal = new CorteFinal({
            folio: folioUnico,
            fecha_inicial:  new Date(),
            usuario: usuario,
            ventas: [],
            sucursal: sucursal
        });

        const corteGuardado = await nuevoCorteFinal.save();
        return corteGuardado.folio; // Devuelve solo el folio

    } catch (error) {
        console.error('Error al crear el corte final:', error);
        throw new Error('Error al crear el corte final');
    }
}

async function generarFolioPadreUnico() {
    let folioPadre;
    let folioExiste = true;

    // Bucle para seguir generando folios hasta que sea único
    while (folioExiste) {
        // Generar un número aleatorio de 4 dígitos
        folioPadre = Math.floor(1000 + Math.random() * 9000);

        // Comprobar si ya existe un corte final con este folio
        const corteExistente = await CorteFinal.findOne({ folio: folioPadre });

        if (!corteExistente) {
            folioExiste = false; // Si no existe, salir del bucle
        }
    }

    return folioPadre.toString(); // Devolver el folio como string si es necesario
}

async function checkCorteUsuarioIniciadoConVentas(userId) {
    try {
        // Buscar el corte para el usuario con un corte iniciado o no finalizado
        const corte = await CorteGeneral.findOne({
            usuario: userId,
            $or: [
                { fecha_inicial: { $exists: true } },
                { fecha_final: { $exists: false } }
            ]
        });

        if (corte) {
            console.log(corte)
            // Verificar si el total de ventas en efectivo supera los $2000
            const totalVentasEfectivo = corte.totalVentasEfectivoCortes || 0; // Asegurar que totalVentasEfectivo exista
            
            if (totalVentasEfectivo > 2000) {
                // Retornar un código indicando que se necesita hacer un corte parcial
                return { 
                    codigo: 1, // Código 1 significa que es necesario hacer un corte parcial
                    folio: corte.folio, 
                    necesitaCorteParcial: true, 
                    totalVentasEfectivo
                };
            } else {
                return { 
                    codigo: 0, // Código 0 significa que no es necesario un corte parcial
                    folio: corte.folio, 
                    necesitaCorteParcial: false, 
                    totalVentasEfectivo
                };
            }
        }

        return { codigo: -1, message: 'No se encontró un corte pendiente.' }; // Código -1 significa que no se encontró un corte
    } catch (error) {
        console.log('Error al buscar corte:', error);
        throw new Error('Error interno del servidor');
    }
}









