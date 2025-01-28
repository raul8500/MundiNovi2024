const Venta = require('../../schemas/venta/ventaSchema');
const Kardex = require('../../schemas/kardexSchema/kardexSchema'); // Asegúrate de ajustar la ruta según tu estructura
const Producto = require('../../schemas/productosSchema/productosSchema');
const Client = require('../../schemas/clientesSchema/clientesSchema');
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
        const vendedor = req.body.venta.usuario._id;
        const sucursal = req.body.venta.sucursalId;
        

        //Zona de cortes
            //Verifica si ya hay un folio para una venta, si no hay, lo crea 
            let corteFolio = '';
            const cortePendiente = await checkCorteUsuarioIniciadoONoFinalizado(vendedor);
            corteFolio = cortePendiente ? cortePendiente : await crearCorteFinal(vendedor, sucursal);
            //
            //verifica si es necesario realizar un corte parcial

            const resultado = await checkCorteUsuarioIniciadoConVentas(vendedor);

            if (resultado.codigo === 1) {
                responseStatus.message = 'Es necesario realizar un corte parcial antes de proceder con la venta.';
                responseStatus.totalEfectivo = resultado.totalVentasEfectivo;
                return res.status(304).json(responseStatus);
            } else if (resultado.codigo === -1) {
                responseStatus.message = 'No se encontró un corte pendiente.';
                return res.status(404).json(responseStatus);
            }
            //


        // Verificación de factura y monedero
        let totalVenta = 0;
        
        const cliente = await Client.findById(req.body.resumenVenta.cliente._id);
        const pagoConMonedero = req.body.resumenVenta.formasDePago.find(
            (forma) => forma.tipo === 'monedero'
        );

        if (cliente && pagoConMonedero) {
            const monederoDisponible = cliente.monedero;
            const montoUsadoMonedero = pagoConMonedero.importe;

            // Aseguramos que el monto usado no exceda el saldo de monedero disponible
            const nuevoSaldoMonedero = Math.max(0, monederoDisponible - montoUsadoMonedero);

            // Actualizamos el saldo del monedero del cliente en la base de datos
            await Client.updateOne(
                { _id: cliente._id },
                { $set: { monedero: nuevoSaldoMonedero } }
            );

            responseStatus.monederoActualizado = true;
        }

        if (req.body.esFactura && req.body.resumenVenta.cliente.esfactura) {
            const facturaResultado = await crearFactura(req);
            responseStatus.facturaCreada = facturaResultado.success;
            if (facturaResultado.success) {
                responseStatus.facturaEnviada = facturaResultado.enviada;
            }
        }


        const productos = req.body.venta.productos;
        let totalProductos = 0;
        const productosConKardex = [];

        for (const producto of productos) {
            const { _id, cantidad, precioConIVA } = producto;
            const productoEncontrado = await Producto.findById(_id);
            if (!productoEncontrado) {
                responseStatus.message = `Producto no encontrado: ${_id}`;
                return res.status(404).json(responseStatus);
            }

            const totalProducto = cantidad * precioConIVA;
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
                costoUnitario: precioConIVA,
                existencia: nuevaExistencia,
            });

            productosConKardex.push({
                nombre: productoEncontrado.name,
                productoId: _id,
                cantidad,
                precio: precioConIVA,
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
            codigoFacturacion: Math.floor(100000 + Math.random() * 900000), // Genera un número aleatorio de 6 dígitos
        });

        responseStatus.nuevaVenta = nuevaVenta;

        const ventaGuardada = await nuevaVenta.save();
        responseStatus.ventaCreada = true;

        if (req.body.metodoEnvio === 'correo') {
            const emailResult = await sendTicketEmail(req.body.email, req.body, sucursal);
            responseStatus.correoEnviado = emailResult.success;
        }


        
        const corteFinal = await CorteFinal.findOne({ folio: corteFolio });

            let totalEfectivoVenta = 0;
            let totalTarjetas = 0;
            let totalTransferencias = 0;
            let montoTransferencias = 0;

            ventaGuardada.formasDePago.forEach(forma => {
                if (forma.tipo === 'cash') {
                    totalEfectivoVenta += forma.importe - forma.cambio;
                } else if (forma.tipo === 'credit-card') {
                    corteFinal.T_credito = (corteFinal.T_credito || 0) + forma.importe;
                    totalTarjetas += forma.importe;
                } else if (forma.tipo === 'debit-card') {
                    corteFinal.T_debito = (corteFinal.T_debito || 0) + forma.importe;
                    totalTarjetas += forma.importe;
                } else if (forma.tipo === 'transfer') {
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

            if (totalEfectivoVenta > 0) {
                corteFinal.totalVentasEfectivoCortes = (corteFinal.totalVentasEfectivoCortes || 0) + totalEfectivoVenta;
            }

            await corteFinal.save();

       await sumarAlMonedero(req)

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
        const productos = req.body.venta.productos;
        const formasDePago = req.body.resumenVenta.formasDePago;

        // Total inicial de la venta y pago con monedero
        const totalVenta = req.body.resumenVenta.totalPagado;
        const pagoConMonedero = formasDePago.find(forma => forma.tipo === 'monedero');
        const montoMonedero = pagoConMonedero ? pagoConMonedero.importe : 0;

        // Calculo inicial del porcentaje de descuento con un solo decimal
        let descuentoPorcentaje = parseFloat(((montoMonedero * 100) / totalVenta).toFixed(1));
        let descuentoTotal = 0;
        let items = [];

        // Función para calcular el descuento total con el porcentaje dado
        function calcularDescuentoTotal(porcentaje) {
            return productos.reduce((total, producto) => {
                const precioFinal = parseFloat((producto.precio * producto.cantidad * 1.16).toFixed(6)); // 6 decimales
                const descuentoAplicado = parseFloat(((precioFinal * porcentaje) / 100).toFixed(1)); // 2 decimales
                return total + descuentoAplicado;
            }, 0);
        }

        // Límite de iteraciones para evitar bucle infinito
        const maxIteraciones = 100;
        let iteracion = 0;

        // Ajustar el porcentaje hasta que el descuento total se acerque al montoMonedero o hasta alcanzar el límite de iteraciones
        while (Math.round(descuentoTotal * 100) / 100 !== montoMonedero && iteracion < maxIteraciones) {
            descuentoTotal = calcularDescuentoTotal(descuentoPorcentaje);

            if (descuentoTotal < montoMonedero) {
                descuentoPorcentaje = parseFloat((descuentoPorcentaje + 0.1).toFixed(1)); // Incrementar porcentaje si falta
            } else if (descuentoTotal > montoMonedero) {
                descuentoPorcentaje = parseFloat((descuentoPorcentaje - 0.1).toFixed(1)); // Reducir porcentaje si excede
            }

            iteracion++;
        }

        // Aplicar el porcentaje final a cada producto
        items = await Promise.all(
            productos.map(async (producto, index) => {
                const productoEncontrado = await Producto.findById(producto._id);
                if (!productoEncontrado) throw new Error(`Producto no encontrado: ${producto._id}`);

                const precioFinal = parseFloat((producto.precio * producto.cantidad * 1.16).toFixed(6)); // 6 decimales
                const descuentoAplicado = parseFloat(((precioFinal * descuentoPorcentaje) / 100).toFixed(2));

                return {
                    tax: [{ id: 1 }],
                    id: productoEncontrado.idAlegra,
                    name: productoEncontrado.name,
                    price: producto.precio,
                    quantity: producto.cantidad,
                    discount: descuentoPorcentaje, // Aplicamos el porcentaje final
                    descuentoAplicado
                };
            })
        );

        // Ajuste final en el último producto si falta o sobra un centavo
        const diferencia = montoMonedero - Math.round(descuentoTotal * 100) / 100;
        if (Math.abs(diferencia) > 0) {
            items[items.length - 1].descuentoAplicado += diferencia;
        }

        // Configuración de los pagos, excluyendo el monedero ya aplicado
        const payments = formasDePago
            .filter(forma => forma.tipo !== 'monedero')
            .map(forma => ({
                account: { id: 1 },
                date: new Date().toISOString(),
                amount: forma.importe - forma.cambio,
                paymentMethod: forma.tipo
            }));

        // Configuración de la solicitud de creación de la factura
        const options = {
            method: 'POST',
            url: 'https://api.alegra.com/api/v1/invoices',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: 'Basic ZmFjdHVyYWxpbXBpb3NAaG90bWFpbC5jb206YWI0MTQ2YzQyZjhkMzY3ZjA1MmQ='
            },
            body: {
                client: 3846,
                stamp: { generateStamp: true },
                paymentMethod: formasDePago[0].tipo,
                cfdiUse: req.body.resumenVenta.cfdiSeleccionado,
                paymentType: 'PUE',
                regimeClient: 'BUSINESS_ACTIVITIES_REGIME',
                status: 'open',
                items,
                date: new Date().toISOString(),
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            },
            json: true
        };

        // Enviamos la solicitud de factura
        return new Promise((resolve) => {
            request(options, async function (error, response, body) {
                if (error) {
                    return resolve({ success: false, message: 'Error en la creación de la factura' });
                }

                // Parsear la respuesta en JSON
                const responseBody = JSON.parse(body);

                // Validar si la factura está en borrador (con error)
                if (responseBody.error && responseBody.invoice && responseBody.invoice.status === 'draft') {
                    return resolve({ 
                        success: false, 
                        message: `Error al crear la factura en borrador: ${responseBody.error.message || 'Error desconocido'}`
                    });
                }

                if (responseBody.id && responseBody.status === 'open') {
                    const invoiceId = responseBody.id;
                    const emailEnviado = await enviarFacturaPorCorreo(invoiceId, responseBody.client.email || 'lopezjo299@gmail.com');
                    return resolve({ success: true, enviada: emailEnviado });
                }

                // Manejo de otros casos de error no especificados
                return resolve({ 
                    success: false, 
                    message: `Error al crear la factura: ${responseBody.error ? responseBody.error.message : 'Error desconocido'}` 
                });
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
        console.log('Entrando en la función sumarAlMonedero');
        
        const clienteId = req.body.resumenVenta.cliente._id;
        
        // Asegurarse de que productos es un array
        const productos = req.body.venta.productos || [];
        console.log('Productos recibidos:', productos);
        
        // Calcular el 1% del totalConIVA de cada producto y sumarlo
        const totalMonedero = productos.reduce((acc, producto) => {
            const porcentajeMonedero = (producto.totalConIVA || 0) * 0.01; // 1% del totalConIVA
            return acc + porcentajeMonedero;
        }, 0);

        console.log('Total calculado para el monedero:', totalMonedero);
        
        // Encuentra el cliente por su ID
        const cliente = await Client.findById(clienteId);
        if (!cliente) {
            throw new Error('Cliente no encontrado');
        }

        // Sumar el total del monedero calculado al monedero actual del cliente
        cliente.monedero = (cliente.monedero || 0) + totalMonedero;

        // Guardar los cambios en la base de datos
        const resultado = await cliente.save();

        console.log('Actualización del monedero completada:', resultado);
        
        return { success: true, cliente: resultado };
    } catch (error) {
        console.error('Error al sumar al monedero:', error.message);
        return { success: false, message: error.message };
    }
}





//Revisa si hay un corte Final creado
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

//Crear un nuevo corte final
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

//Corte para realizar un corte parcial
async function checkCorteUsuarioIniciadoConVentas(userId) {
    try {
        // Buscar el corte para el usuario con un corte iniciado o no finalizado
        const corte = await CorteFinal.findOne({
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

//generar un folio padre unico
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

const generateFolio = () => {
  return String(Math.floor(1000000 + Math.random() * 9000000)); // Genera un número aleatorio de 7 dígitos
};







//Reportes
exports.getReporteVentaProducto = async (req, res) => {
  try {
    const { sucursal, fechaInicio, fechaFin, limite } = req.params;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ error: 'Fecha de inicio y fecha final son requeridas.' });
    }

    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);

    if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
      return res.status(400).json({ error: 'Fecha de inicio o fecha final inválida.' });
    }

    // Ajustar fechas a UTC
    fechaInicioDate.setUTCHours(0, 0, 0, 0); // Inicio del día en UTC
    fechaFinDate.setUTCHours(23, 59, 59, 999); // Fin del día en UTC

    // Obtener todos los productos
    const productos = await Producto.find({}, 'reference name');

    // Obtener ventas en el rango de fechas y sucursal
    const ventas = await Venta.aggregate([
      {
        $match: {
          fecha: {
            $gte: fechaInicioDate,
            $lte: fechaFinDate,
          },
          ...(sucursal && { sucursal: new mongoose.Types.ObjectId(sucursal) }),
        },
      },
      { $unwind: '$productos' },
      {
        $group: {
          _id: '$productos.productoId',
          cantidadVendida: { $sum: '$productos.cantidad' },
        },
      },
    ]);

    // Crear un mapa de productos vendidos
    const ventasMap = ventas.reduce((acc, venta) => {
      acc[venta._id.toString()] = venta.cantidadVendida;
      return acc;
    }, {});

    // Construir el reporte
    let reporte = productos.map((producto) => ({
      clave: producto.reference,
      nombre: producto.name,
      cantidad: ventasMap[producto._id.toString()] || 0, // 0 si no hay ventas
    }));

    // Si se envió un límite mayor a 0, ordenar por cantidad vendida y aplicar el límite
    if (limite && parseInt(limite) > 0) {
      reporte = reporte
        .sort((a, b) => b.cantidad - a.cantidad) // Ordenar de mayor a menor cantidad
        .slice(0, parseInt(limite)); // Limitar los resultados
    }

    res.status(200).json({ data: reporte });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar el reporte de ventas.' });
  }
};
