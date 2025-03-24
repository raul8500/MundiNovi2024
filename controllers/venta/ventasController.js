const CorteFinal = require('../../schemas/cortes/cortesFinalesSchema');
const Producto = require('../../schemas/productosSchema/productosSchema');
const Kardex = require('../../schemas/kardexSchema/kardexSchema');
const Venta = require('../../schemas/venta/ventaSchema');
const Cliente = require('../../schemas/clientesSchema/clientesSchema');

const moment = require('moment-timezone');
//const alegra = require('../../.api/apis/alegra-factura');

exports.createVenta = async (req, res) => { 
    try {        
        //Verificar si existe un corte creado
        const cortePendiente = await checkCorteIniciadoONoFinalizado(req.body.cajero.id);
        let corteFolio = cortePendiente ? cortePendiente : await crearCorteFinal(req.body.cajero.id, req.body.sucursal.id);

        //Moviemiento en Kardex
        const productos = req.body.productos;
        const productosConKardex = [];

        for (const producto of productos) {
            const { id,nombre,reference,precioSinIva, precioConIva, precio1, cantidad } = producto;

            const ultimoKardex = await Kardex.findOne({ reference: reference }).sort({ fecha: -1 });
            const nuevaExistencia = ultimoKardex ? ultimoKardex.existencia - cantidad : -cantidad;

            const folio = generateFolio();
            const nuevoKardex = await Kardex.create({
                fecha: moment.tz("America/Mexico_City").format(),
                folio,
                usuario: req.body.cajero.id,
                movimiento: 'Venta',
                sucursal: req.body.sucursal.id,
                reference,
                nombre,
                cantidad: -cantidad,
                costoUnitario : precioConIva, 
                existencia: nuevaExistencia,
            });

            productosConKardex.push({
                id,nombre,reference,precioSinIva, precioConIva, precio1, cantidad,
                kardexId: nuevoKardex._id,
                kardexFolio: folio,
            });
        }

        //Verificar si se factura
        let factura = req.body.factura;
        let facturaMensaje = null; // Variable para almacenar el mensaje de la factura
        let facturaBody = '';

        if (factura) {
            // Si se factura, llamar a la función crearFactura y almacenar su respuesta en la variable
            facturaMensaje = await crearFactura(req.body);

            if(facturaMensaje.statusCode == 200){
                facturaBody =
                    {
                        codigoFacturacion: Math.floor(100000 + Math.random() * 900000),
                        estado: 1,
                        idAlegraFacura : facturaMensaje.id,
                        pdfUrl : '',
                        xmlUrl: '',
                    }
                console.log('Factura emitida correctamente')
            }else{
                if(facturaMensaje.statusCode == 400){
                    facturaBody =
                    {
                        codigoFacturacion: Math.floor(100000 + Math.random() * 900000),
                        estado: 2,
                        idAlegraFacura : '',
                        pdfUrl : '',
                        xmlUrl: '',
                    }
                    console.log('Factura creada pero no timbrada')
                }else{
                    console.log('Error en el servidor o en alegra')
                }
            }
        }else{
            facturaBody = {
                codigoFacturacion: Math.floor(100000 + Math.random() * 900000),
                estado: 0,
                idAlegraFacura: '',
                pdfUrl : '',
                xmlUrl: '',
            }
        }
        

        //Registrar Venta
        const nuevaVenta = new Venta({
            noVenta: generateFolio(),
            vendedor: req.body.cajero.id,
            sucursal: req.body.sucursal.id,
            tipoVenta: req.body.factura,
            cliente: req.body.cliente.id && req.body.cliente.id !== '' ? req.body.cliente.id : null,
            totalVenta: req.body.totalVenta,
            totalProductos: req.body.totalProductosCantidad,
            productos: productosConKardex,
            pagos:{
                formasDePago: req.body.formasDePago,
                cambio: req.body.cambio
            },
            factura: facturaBody,
            fecha: moment.tz("America/Mexico_City").format()
        });

                
        const ventaGuardada = await nuevaVenta.save();

        //Añadir a Corte
        const corteFinal = await CorteFinal.findOne({ folio: corteFolio });

        ventaGuardada.pagos.formasDePago.forEach(forma => {
            if (forma.forma === 'cash') {
                corteFinal.finanzasTotales.T_efectivo += forma.importe - req.body.cambio;
                corteFinal.totalVentasEfectivoSinCortes += forma.importe - req.body.cambio;
                corteFinal.total_ventas += forma.importe - req.body.cambio;
            } else if (forma.forma === 'credit-card') {
                corteFinal.finanzasTotales.T_credito += forma.importe
                corteFinal.finanzasTotales.T_tarjetas += forma.importe;
                corteFinal.total_ventas += forma.importe
            } else if (forma.forma === 'debit-card') {
                corteFinal.finanzasTotales.T_debito += forma.importe
                corteFinal.finanzasTotales.T_tarjetas += forma.importe;
                corteFinal.total_ventas += forma.importe
            } else if (forma.forma === 'transfer') {
                corteFinal.finanzasTotales.T_transferencias += forma.importe
                corteFinal.total_ventas += forma.importe
            }else if(forma.forma = 'electronic-wallet'){
                corteFinal.finanzasTotales.T_monedero += forma.importe
                corteFinal.total_ventas += forma.importe
            }
        });

        corteFinal.ventas.push(
            ventaGuardada._id,
        );

        await corteFinal.save();

        //Sumar al monedero
        let cliente = ''
        let monedero = ''
        if(req.body.cliente.id != ''){
            cliente = await Cliente.findOne({ _id: req.body.cliente.id });
            monedero = await calcularMonedero(req.body.productos)
            console.log('total monedero: '+monedero)
            cliente.monedero += monedero

            let importeMonedero = 0;
            //restar del monedero
            req.body.formasDePago.forEach(forma => {
                if (forma.forma === 'electronic-money') {
                    // Si encontramos el método de pago "electronic-money", guardamos su importe
                    importeMonedero = forma.importe;
                    cliente.monedero -= importeMonedero
                    console.log('entro')
                }
            });

            await cliente.save()
        }else{
            console.log('sin cliente')
        }

        
        const ventaDatos = await Venta.findOne({ _id: ventaGuardada._id })
            .populate('vendedor')
            .populate('sucursal')
            .populate('cliente')  
            .populate('sucursal.idFranquicia');

        res.status(201).json(ventaDatos);

    }catch(err){
        console.log(err)
    }
}

//Revisa si hay un corte Final creado
async function checkCorteIniciadoONoFinalizado(userId) {
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
        
        // Obtener la fecha y hora en la zona horaria de CDMX
        const fechaCDMX = moment.tz("America/Mexico_City").format(); // Usa formato ISO 8601 para asegurarnos de que sea compatible

        const nuevoCorteFinal = new CorteFinal({
            folio: folioUnico,
            fecha_inicial: fechaCDMX, // Se asigna la fecha en la zona horaria de CDMX
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

async function crearFactura(body) {
    try {   
        const cliente = await Cliente.findById(body.cliente.id);
        
        let payments = [];

        for (let i = 0; i < body.formasDePago.length; i++) {
            const forma = body.formasDePago[i];

            // Si encontramos un método de pago "monedero", detenemos el proceso y asignamos null a payments
            if (forma.forma === 'electronic-wallet') {
                payments = null;
                break; // Sale del ciclo
            }

            // Si el tipo de pago es 'cash', realiza la operación con el cambio
            if (forma.forma === 'cash') {
                payments.push({
                    account: { id: 2 },
                    date: moment.tz("America/Mexico_City").format(),
                    amount: forma.importe - body.cambio, // Asegúrate de que body.cambio esté definido y tenga el valor correcto
                    paymentMethod: forma.forma
                });
            } else {
                // Si el tipo de pago no es 'cash', solo se agrega el importe
                payments.push({
                    account: { id: 2 },
                    date: moment.tz("America/Mexico_City").format(),
                    amount: forma.importe, // Asegúrate de que forma.importe esté bien asignado
                    paymentMethod: forma.forma
                });
            }
        }

        let singlePaymentMethod = null;

        if (body.formasDePago.length === 1 && body.formasDePago[0].forma !== 'electronic-wallet') {
            // Si hay solo una forma de pago y no es monedero, asigna la forma a singlePaymentMethod
            singlePaymentMethod = body.formasDePago[0].forma;
        } else {
            // Si hay más de una forma de pago o es monedero, asigna null
            singlePaymentMethod = body.formasDePago[0].forma;
        }

        let items = body.productos;

        const transformedItems = items.map(item => ({
            id: item.idAlegra,      
            tax: [{ id: '1' }],         
            price: item.precioSinIva,        
            quantity: item.cantidad 
        }));

        // Autenticación con las credenciales de Alegra
        alegra.auth('facturalimpios@hotmail.com', 'ab4146c42f8d367f052d');
        
        // Solicitar la creación de la factura
        const { data } = await alegra.postInvoices({
            client: { id: cliente.idAlegra || null },
            stamp: { generateStamp: true },
            paymentMethod: singlePaymentMethod,
            cfdiUse: body.usoCFDI,
            paymentType: 'PUE',
            regimeClient: cliente.clientData.regime,
            items: transformedItems,
            date: moment.tz("America/Mexico_City").format(),
            dueDate: moment.tz("America/Mexico_City").format(),
            payments: payments
        });

        // Si todo sale bien, devolver status 200 y los datos de la factura
        return { statusCode: 200, data };

    } catch (err) {
        // Manejo del error, devolviendo status 400 y el mensaje de error
        if (err.status == 400) {
            // Si el error proviene de la API de Alegra, devuelve el mensaje de error
            return {
                statusCode: err.status,
                message: err.data.message
            };
        } else {
            // Si el error es genérico
            return {
                statusCode: 500,
                message: 'Error al crear la factura'
            };
        }
    }
}



//Extras
async function calcularMonedero(productos) {
    try {
        let monederoTotal = 0; // Total a devolver al cliente

        for (let i = 0; i < productos.length; i++) {
            const producto = productos[i];
            const cantidad = producto.cantidad;
            const productoId = producto.id;

            // Buscar el producto en la base de datos (suponiendo que tienes una función para esto)
            const productoBD = await Producto.findById(productoId);

            // Verificar si el producto tiene porcentajeMonedero asignado
            if (productoBD && productoBD.datosFinancieros) {
                let porcentajeMonedero = 0;

                // Recorremos los 10 posibles rangos
                for (let j = 1; j <= 10; j++) {
                    const rangoInicial = productoBD.datosFinancieros[`rangoInicial${j}`];
                    const rangoFinal = productoBD.datosFinancieros[`rangoFinal${j}`];
                    const porcentaje = productoBD.datosFinancieros[`porcentajeMonedero${j}`];

                    // Si la cantidad está dentro de un rango, asignamos el porcentaje correspondiente
                    if (cantidad >= rangoInicial && cantidad <= rangoFinal) {
                        porcentajeMonedero = porcentaje;
                        break; // Salimos del ciclo cuando encontramos el rango
                    }
                }

                // Si se encontró un porcentajeMonedero, lo calculamos
                if (porcentajeMonedero > 0) {
                    const precioConIva = producto.precioConIva || 0;
                    const totalProducto = precioConIva * cantidad;

                    // Sumamos lo que se le debe al cliente
                    const montoMonedero = (porcentajeMonedero / 100) * totalProducto;
                    monederoTotal += montoMonedero;
                }
            }
        }

        // Retornar el total del monedero calculado
        return monederoTotal;

    } catch (err) {
        console.error("Error al calcular el monedero:", err);
        throw new Error("Error al calcular el monedero");
    }
}
//Generar un folio padre unico
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
//Generar folio kardex
const generateFolio = () => {
    return String(Math.floor(1000000 + Math.random() * 9000000));
};