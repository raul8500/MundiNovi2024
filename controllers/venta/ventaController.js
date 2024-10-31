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
    return new Promise(async (resolve, reject) => {
        try {
            // Verificar si el correo ya existe
            const correoExistente = await Email.findOne({ email });
            if (!correoExistente) {
                // Guardar el correo si no existe
                await Email.create({ email });
            }

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

exports.createVenta = async (req, res) => {
    let vendedor = req.body.venta.usuario._id;
    const sucursal = req.body.venta.sucursalId;

    try {
        console.log("Iniciando proceso de creación de venta");

        let corteFolio = '';
        const cortePendiente = await checkCorteUsuarioIniciadoONoFinalizado(vendedor);
        corteFolio = cortePendiente ? cortePendiente : await crearCorteFinal(vendedor, sucursal);

        console.log("Corte pendiente verificado, folio:", corteFolio);

        const resultado = await checkCorteUsuarioIniciadoConVentas(vendedor);
        if (resultado.codigo == 1) {
            console.log("Corte parcial necesario");
            return res.status(304).json({
                message: 'Es necesario realizar un corte parcial antes de proceder con la venta.',
                totalEfectivo: resultado.totalVentasEfectivo
            });
        } else if (resultado.codigo == -1) {
            console.log("No se encontró corte pendiente");
            return res.status(404).json({ message: 'No se encontró un corte pendiente.' });
        }

        // Verificación de facturación
        if (req.body.resumenVenta.cliente.esfactura) {
            console.log("Creando factura...");
            const facturaResultado = await crearFactura(req);
            if (!facturaResultado.success) {
                console.log("Error al crear la factura:", facturaResultado.message);
                return res.status(400).json({ message: facturaResultado.message });
            }
            console.log("Factura creada exitosamente");
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
                console.log("Producto no encontrado:", _id);
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
            tipoVenta,
            cliente,
            totalVenta,
            totalProductos,
            productos: productosConKardex,
            formasDePago,
        });

        const ventaGuardada = await nuevaVenta.save();
        console.log("Venta guardada correctamente:", ventaGuardada._id);
        res.status(201).json({ message: 'Venta creada correctamente', data: ventaGuardada });
    } catch (error) {
        console.error("Error en createVenta:", error);
        res.status(500).json({ error: 'Error general en la creación de la venta' });
    }
};

async function crearFactura(req) {
    try {
        const items = await Promise.all(
            req.body.venta.productos.map(async (producto) => {
                try {
                    // Buscar el producto en MongoDB usando su _id
                    const productoEncontrado = await Producto.findById(producto._id);

                    if (!productoEncontrado) {
                        throw new Error(`Producto no encontrado: ${producto._id}`);
                    }

                    return {
                        tax: [{ id: 1 }], // ID de impuesto
                        id: productoEncontrado.idAlegra, // ID de Alegra desde MongoDB
                        name: productoEncontrado.name, // Nombre del producto
                        price: producto.precio, // Precio del producto
                        quantity: producto.cantidad // Cantidad de venta
                    };
                } catch (error) {
                    console.error('Error al obtener el producto:', error);
                    throw new Error('Error al obtener el producto de MongoDB');
                }
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
                items, // Usar el arreglo de items creado arriba
                payments,
                date: new Date().toISOString(),
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            },
            json: true
        };

        console.log("Request de factura:", options.body);

        return new Promise((resolve, reject) => {
            request(options, async function (error, response, body) {
                if (error) {
                    console.error("Error en la petición de creación de factura:", error);
                    return reject({ success: false, message: 'Error en la creación de la factura' });
                }

                console.log("Respuesta de Alegra:", body);

                if (body.invoice && body.invoice.id) {
                    const invoiceId = body.invoice.id;
                    const emailEnviado = await enviarFacturaPorCorreo(invoiceId, body.invoice.client.email);

                    if (emailEnviado) {
                        resolve({ success: true, message: 'Factura creada y enviada por correo con éxito' });
                    } else {
                        resolve({ success: false, message: 'Factura creada, pero no se pudo enviar el correo' });
                    }
                } else {
                    reject({ success: false, message: `Error al crear la factura: ${body.error ? body.error.message : 'Error desconocido'}` });
                }
            });
        });
    } catch (error) {
        console.error("Error en crearFactura:", error);
        throw new Error('Error en la creación de la factura');
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









