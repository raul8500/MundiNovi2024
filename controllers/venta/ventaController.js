const Venta = require('../../schemas/venta/ventaSchema');
const Kardex = require('../../schemas/kardexSchema/kardexSchema'); // Asegúrate de ajustar la ruta según tu estructura
const Producto = require('../../schemas/productosSchema/productosSchema');
const Client = require('../../schemas/clientesSchema/clientesSchema');
const CorteGeneral = require('../../schemas/cortes/cortesFinalesSchema');
const CorteFinal = require('../../schemas/cortes/cortesFinalesSchema');
const Email = require('../../schemas/venta/emailSchema');

const mongoose = require('mongoose');
const request = require('request');
const nodemailer = require('nodemailer');
const http = require('https');

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

async function sendTicketEmail(email, venta, sucursalInfo) {
    try {
        const correoExistente = await Email.findOne({ email });
        if (!correoExistente) {
            await Email.create({ email });
        }

        let ticketContent = `
            <h1>Ticket de Venta</h1>
            <p>Sucursal: ${sucursalInfo.nombre}</p>
            <p>Total de venta: $${venta.venta.totalVenta}</p>
            <ul>
            ${venta.venta.productos.map(p => `<li>${p.nombre} - ${p.cantidad} unidades a $${p.precio}</li>`).join('')}
            </ul>
        `;

        let mailOptions = {
            from: 'mundinovi.dev@gmail.com',
            to: email,
            subject: 'Ticket de tu compra',
            html: ticketContent,
        };

        console.log('Enviando correo...');
        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Correo enviado correctamente' };
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        return { success: false, message: 'Error al enviar el correo' };
    }
}

exports.createVenta = async (req, res) => {

    const responseStatus = {
        ventaCreada: false
    };

    try {
        console.log("Iniciando proceso de creación de venta");

        const vendedor = req.body.venta.usuario._id;
        const sucursal = req.body.venta.sucursalId;
        
        let corteFolio = '';
        const cortePendiente = await checkCorteUsuarioIniciadoONoFinalizado(vendedor);
        corteFolio = cortePendiente ? cortePendiente : await crearCorteFinal(vendedor, sucursal);

        const resultado = await checkCorteUsuarioIniciadoConVentas(vendedor);
        if (resultado.codigo === 1) {
            responseStatus.message = 'Es necesario realizar un corte parcial antes de proceder con la venta.';
            responseStatus.totalEfectivo = resultado.totalVentasEfectivo;
            return res.status(304).json(responseStatus);
        } else if (resultado.codigo === -1) {
            responseStatus.message = 'No se encontró un corte pendiente.';
            return res.status(404).json(responseStatus);
        }

        if (req.body.esFactura && req.body.resumenVenta.cliente.esfactura) {
            console.log("Creando factura...");
            const facturaResultado = await crearFactura(req);
            responseStatus.facturaCreada = facturaResultado.success;
            if (facturaResultado.success) {
                responseStatus.facturaEnviada = facturaResultado.enviada;
                console.log("Factura creada correctamente");
            } else {
                console.log("Error al crear la factura:", facturaResultado.message);
            }
        }
        
        if (req.body.resumenVenta.cliente) {
            console.log("Sumando al monedero...");
            const monederoResultado = await sumarAlMonedero(req);
            responseStatus.monederoActualizado = monederoResultado.success;
            if (monederoResultado.success) {
                console.log("Monedero actualizado correctamente");
            } else {
                console.log("Error al actualizar el monedero:", monederoResultado.message);
            }
        }


        const productos = req.body.venta.productos;
        let totalVenta = 0;
        let totalProductos = 0;
        const productosConKardex = [];

        for (const producto of productos) {
            const { _id, cantidad, precio } = producto;
            const productoEncontrado = await Producto.findById(_id);
            if (!productoEncontrado) {
                responseStatus.message = `Producto no encontrado: ${_id}`;
                return res.status(404).json(responseStatus);
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

            console.log("Kardex actualizado para producto:", productoEncontrado.name);

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
            tipoVenta: req.body.resumenVenta.esFactura,
            cliente: req.body.resumenVenta.cliente ? req.body.resumenVenta.cliente._id : null,
            totalVenta,
            totalProductos,
            productos: productosConKardex,
            formasDePago: req.body.resumenVenta.formasDePago,
        });

        const ventaGuardada = await nuevaVenta.save();
        responseStatus.ventaCreada = true;
        console.log("Venta guardada correctamente:", ventaGuardada._id);

        if (req.body.metodoEnvio === 'correo') {
            const emailResult = await sendTicketEmail(req.body.email, req.body, sucursal);
            responseStatus.correoEnviado = emailResult.success;
            if (!emailResult.success) {
                console.log(emailResult.message);
            }
        }

        responseStatus.message = 'Proceso de creación de venta completado.';
        res.status(201).json(responseStatus);

    } catch (error) {
        console.error("Error en createVenta:", error);
        responseStatus.message = 'Error general en la creación de la venta';
        res.status(500).json(responseStatus);
    }
};

async function crearFactura(req) {
    try {
        const items = await Promise.all(
            req.body.venta.productos.map(async (producto) => {
                const productoEncontrado = await Producto.findById(producto._id);
                if (!productoEncontrado) throw new Error(`Producto no encontrado: ${producto._id}`);
                
                return {
                    tax: [{ id: 1 }],
                    id: productoEncontrado.idAlegra,
                    name: productoEncontrado.name,
                    price: producto.precio,
                    quantity: producto.cantidad
                };
            })
        );

        const payments = req.body.resumenVenta.formasDePago.map(forma => ({
            account: { id: 1 },
            date: new Date().toISOString(),
            amount: forma.importe - forma.cambio,
            paymentMethod: forma.tipo
        }));

        const options = {
            method: 'POST',
            url: 'https://api.alegra.com/api/v1/invoices',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: 'Basic ZmFjdHVyYWxpbXBpb3NAaG90bWFpbC5jb206YWI0MTQ2YzQyZjhkMzY3ZjA1MmQ='
            },
            body: {
                client: 4986,
                stamp: { generateStamp: true },
                paymentMethod: req.body.resumenVenta.formasDePago[0].tipo,
                cfdiUse: req.body.resumenVenta.cfdiSeleccionado,
                paymentType: 'PUE',
                regimeClient: 'Personas Físicas con Actividades Empresariales y Profesionales',
                status: 'open',
                items,
                payments,
                date: new Date().toISOString(),
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            },
            json: true
        };

        return new Promise((resolve) => {
            request(options, async function (error, response, body) {
                if (error) return resolve({ success: false, message: 'Error en la creación de la factura' });

                if (body.invoice && body.invoice.id) {
                    const invoiceId = body.invoice.id;
                    const emailEnviado = await enviarFacturaPorCorreo(invoiceId, body.invoice.client.email);
                    resolve({ success: true, enviada: emailEnviado });
                } else {
                    resolve({ success: false, message: `Error al crear la factura: ${body.error ? body.error.message : 'Error desconocido'}` });
                }
            });
        });
    } catch (error) {
        console.error("Error en crearFactura:", error);
        return { success: false, message: 'Error en la creación de la factura' };
    }
}

function enviarFacturaPorCorreo(invoiceId, email) {
    return new Promise((resolve) => {
        const options = {
            method: 'POST',
            hostname: 'api.alegra.com',
            path: `/api/v1/invoices/${invoiceId}/email`,
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: 'Basic ZmFjdHVyYWxpbXBpb3NAaG90bWFpbC5jb206YWI0MTQ2YzQyZjhkMzY3ZjA1MmQ='
            }
        };

        const req = http.request(options, function (res) {
            if (res.statusCode === 200) {
                console.log("Correo enviado exitosamente");
                resolve(true);
            } else {
                console.error("Error al enviar correo, código de estado:", res.statusCode);
                resolve(false);
            }
        });

        req.write(JSON.stringify({ emails: [email], sendCopyToUser: true }));
        req.end();

        req.on('error', (err) => {
            console.error("Error en la petición de correo:", err);
            resolve(false);
        });
    });
}

async function sumarAlMonedero(req) {
    try {
        const clienteId = req.body.resumenVenta.cliente._id;
        console.log(req.body.venta.productos)
        // Asegurarse de que productos es un array y calcular el total de monedero sumando cada producto
        const productos = req.body.venta.productos || [];
        const totalMonedero = productos.reduce((acc, producto) => acc + (producto.monedero || 0), 0);

        // Encuentra el cliente por su ID
        const cliente = await Client.findById(clienteId);
        
        if (!cliente) {
            throw new Error('Cliente no encontrado');
        }

        // Sumar el total del monedero calculado al monedero actual del cliente
        cliente.monedero = (cliente.monedero || 0) + totalMonedero;

        // Guardar los cambios en la base de datos
        const resultado = await cliente.save();

        return { success: true, cliente: resultado };
    } catch (error) {
        console.error("Error al sumar al monedero:", error.message);
        return { success: false, message: error.message };
    }
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









