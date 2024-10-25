const Venta = require('../../schemas/venta/ventaSchema');
const Kardex = require('../../schemas/kardexSchema/kardexSchema'); // Asegúrate de ajustar la ruta según tu estructura
const Producto = require('../../schemas/productosSchema/productosSchema');
const Client = require('../../schemas/clientesSchema/clientesSchema');
const CorteGeneral = require('../../schemas/cortes/cortesFinalesSchema');
const CorteFinal = require('../../schemas/cortes/cortesFinalesSchema');


const mongoose = require('mongoose');
const request = require('request');
const nodemailer = require('nodemailer');


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

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mundinovi.dev@gmail.com', // Cambia esto por tu correo electrónico
        pass: 'ueli etdv qbcm goyt', // Cambia esto por tu contraseña o usa una contraseña de aplicación
    },
});

exports.createVenta = async (req, res) => {
    let vendedor = req.body.venta.usuario._id;
    const sucursal = req.body.venta.sucursalId;

    try {
        let corteFolio = '';
        
        // Verificar si hay un corte pendiente
        const cortePendiente = await checkCorteUsuarioIniciadoONoFinalizado(vendedor);
        corteFolio = cortePendiente ? cortePendiente : await crearCorteFinal(vendedor, sucursal);

        // Verificar si es necesario hacer un corte parcial
        const resultado = await checkCorteUsuarioIniciadoConVentas(vendedor);
        if (resultado.codigo == 1) {
            return res.status(304).json({
                message: 'Es necesario realizar un corte parcial antes de proceder con la venta.',
                totalEfectivo: resultado.totalVentasEfectivo
            });
        } else if (resultado.codigo == -1) {
            return res.status(404).json({ message: 'No se encontró un corte pendiente.' });
        }

        // Facturación si aplica
        if (req.body.resumenVenta.cliente.esfactura) {
            crearFactura(req);
        }

        const productos = req.body.venta.productos;
        const tipoVenta = req.body.resumenVenta.esFactura;
        const cliente = req.body.resumenVenta.cliente ? req.body.resumenVenta.cliente._id : null;
        const totalAPagar = req.body.venta.totalVenta;
        const formasDePago = req.body.resumenVenta.formasDePago;

        let totalVenta = 0;
        let totalProductos = 0;
        const productosConKardex = [];

        for (const producto of productos) {
            const { _id, cantidad, precio } = producto;
            const productoEncontrado = await Producto.findById(_id);
            if (!productoEncontrado) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            const totalProducto = cantidad * precio;
            totalVenta += totalProducto;
            totalProductos += cantidad;

            const ultimoKardex = await Kardex.findOne({ reference: productoEncontrado.reference }).sort({ fecha: -1 });
            const nuevaExistencia = ultimoKardex ? ultimoKardex.existencia - cantidad : -cantidad;

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

            await Producto.updateOne({ _id }, { $set: { controlAlmacen: nuevaExistencia } });
            productosConKardex.push({
                nombre: productoEncontrado.name,
                productoId: _id,
                cantidad,
                precio,
                kardexId: nuevoKardex._id,
                kardexFolio: folio,
            });
        }

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
        const corteFinal = await CorteFinal.findOne({ folio: corteFolio });

        let totalEfectivoVenta = 0, totalTarjetas = 0, montoTransferencias = 0;

        ventaGuardada.formasDePago.forEach(forma => {
            if (forma.tipo === 'efectivo') totalEfectivoVenta += forma.importe - forma.cambio;
            else if (forma.tipo === 'tarjeta credito') corteFinal.T_credito = (corteFinal.T_credito || 0) + forma.importe;
            else if (forma.tipo === 'tarjeta debito') corteFinal.T_debito = (corteFinal.T_debito || 0) + forma.importe;
            else if (forma.tipo === 'transferencia') {
                corteFinal.transferencias = true;
                montoTransferencias += forma.importe;
            }
        });

        corteFinal.total_tarjetas = (corteFinal.total_tarjetas || 0) + totalTarjetas;
        corteFinal.monto_transferencias = (corteFinal.monto_transferencias || 0) + montoTransferencias;
        corteFinal.ventas.push({ venta: ventaGuardada._id, contada: false });
        if (totalEfectivoVenta > 0) corteFinal.totalVentasEfectivoCortes = (corteFinal.totalVentasEfectivoCortes || 0) + totalEfectivoVenta;

        await corteFinal.save();

        // Enviar ticket por correo (de forma asíncrona)
        if (req.body.metodoEnvio === 'correo') {
            console.log('adios')
            let email = req.body.email;
            sendTicketEmail(email, nuevaVenta, sucursal)
                .then(() => console.log('Correo enviado correctamente'))
                .catch(err => console.error('Error al enviar el correo:', err)); // Manejo de errores en segundo plano
        }

        res.status(201).json({ message: 'Venta creada correctamente', data: ventaGuardada });
    } catch (error) {
        res.status(500).json({ error: 'Error general en la creación de la venta' });
    }
};

function sendTicketEmail(email, venta, sucursalInfo) {
    return new Promise(async (resolve, reject) => {
        try {
            // Generar contenido del ticket
            let ticketContent = `
                <h1>Ticket de Venta</h1>
                <p>Sucursal: ${sucursalInfo.nombre}</p>
                <p>Total de venta: $${venta.totalVenta}</p>
                <ul>
                ${venta.productos.map(p => `<li>${p.nombre} - ${p.cantidad} unidades a $${p.precio}</li>`).join('')}
                </ul>
            `;

            // Opciones del correo
            let mailOptions = {
                from: 'mundinovi.dev@gmail.com',
                to: email,
                subject: 'Ticket de tu compra',
                html: ticketContent,
            };

            console.log('Enviando correo...');
            await transporter.sendMail(mailOptions);
            resolve(); // Correo enviado correctamente
        } catch (error) {
            reject(error); // Error al enviar el correo
        }
    });
}

async function crearFactura(req) {
    // Construir los productos (items) obteniendo su id de Alegra desde MongoDB
    const items = await Promise.all(
        req.body.venta.productos.map(async (producto) => {
            try {
                // Buscar el producto en la base de datos MongoDB usando su _id
                const productoEncontrado = await Producto.findById(producto._id);

                if (!productoEncontrado) {
                    throw new Error(`Producto no encontrado: ${producto._id}`);
                }

                return {
                    tax: [{ id: 1 }], // ID de impuesto siempre es 1
                    id: productoEncontrado.idAlegra, // ID recuperado de la base de datos (idAlegra)
                    name: productoEncontrado.name, // Nombre del producto
                    price: producto.precio, // Precio del producto (lo que viene de la venta)
                    quantity: producto.cantidad // Cantidad del producto
                };
            } catch (error) {
                console.error('Error al obtener el producto:', error);
                throw new Error('Error al obtener el producto de MongoDB');
            }
        })
    );

    // Construir los pagos (payments)
    const payments = req.body.resumenVenta.formasDePago.map((formaDePago) => {
        let amount = formaDePago.importe;

        // Si el método de pago es "cash", restar el cambio al importe
        if (formaDePago.tipo === 'cash') {
            const cambio = parseFloat(req.body.resumenVenta.cambio) || 0;
            amount -= cambio;
        }

        return {
            account: { id: 1 }, // ID de cuenta siempre es 1
            date: Date.now(), // Fecha actual
            amount: amount, // Importe ajustado si es "cash"
            paymentMethod: formaDePago.tipo // Tipo de pago
        };
    });

    // Construir el cuerpo (body) para la factura
    const body = {
        client: { id: req.body.resumenVenta.cliente.clientData.id },
        stamp: { generateStamp: true },
        paymentMethod: req.body.resumenVenta.formasDePago[0].tipo,
        cfdiUse: req.body.resumenVenta.cfdiSeleccionado,
        paymentType: 'PUE',
        regimeClient: req.body.resumenVenta.cliente.clientData.regimeObject[0],
        status: 'open',
        items: items, // Los productos construidos
        payments: payments, // Los pagos construidos
        date: Date.now(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 1 mes después
    };

    // Opciones para la petición
    const options = {
        method: 'POST',
        url: 'https://api.alegra.com/api/v1/invoices',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: 'Basic ZmFjdHVyYWxpbXBpb3NAaG90bWFpbC5jb206YWI0MTQ2YzQyZjhkMzY3ZjA1MmQ='        
        },
        body: body,
        json: true
    };

    // Realizar la petición
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
    });
}

const generateFolio = () => {
  return String(Math.floor(1000000 + Math.random() * 9000000)); // Genera un número aleatorio de 7 dígitos
};

async function checkCorteUsuarioIniciadoONoFinalizado(userId) {
    try {
        const corte = await CorteFinal.findOne({
            usuario: userId,
            folio: { $exists: true },  // Asegura que el folio exista (es decir, que el corte esté iniciado)
            fecha_final: { $exists: false }  // Verifica que el corte no esté finalizado
        });

        // Si existe un corte iniciado y no finalizado, retorna el folio
        if (corte) {
            return corte.folio;  // Devolver el folio del corte
        }

        // Si no hay corte iniciado ni pendiente, retorna null
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









