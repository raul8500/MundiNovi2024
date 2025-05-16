const CorteFinal = require('../../schemas/cortes/cortesFinalesSchema');
const Producto = require('../../schemas/productosSchema/productosSchema');
const Kardex = require('../../schemas/kardexSchema/kardexSchema');
const Venta = require('../../schemas/venta/ventaSchema');
const Cliente = require('../../schemas/clientesSchema/clientesSchema');

const moment = require('moment-timezone');

const Facturapi = require('facturapi').default;
const facturapi = new Facturapi('sk_test_GO8zw0Xo52mM1kgLW3a1Y8OydL9Nel4JBEZabDQ3Yv');


exports.createVenta = async (req, res) => { 
    try {

        //Verificar si existe un corte creado
        const cortePendiente = await checkCorteIniciadoONoFinalizado(req.body.cajero.id);
        let corteFolio = cortePendiente ? cortePendiente : await crearCorteFinal(req.body.cajero.id, req.body.sucursal.id);

        //Moviemiento en Kardex
        const productos = req.body.productos;
        const productosConKardex = [];

        for (const producto of productos) {
            const { id,nombre,reference, precioSinIva, precioConIva, precio1, cantidad, costo } = producto;

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
                costoUnitario : costo, 
                existencia: nuevaExistencia,
            });

            productosConKardex.push({
                id,nombre,reference, precioConIva, precio1, cantidad, costo,
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
            facturaMensaje = await crearFacturaAPI(req.body);

            if(facturaMensaje.statusCode == 200){
                facturaBody =
                    {
                        codigoFacturacion: Math.floor(100000 + Math.random() * 900000),
                        estado: 1,
                        idAlegraFacura : facturaMensaje.invoice.id,
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
    
        req.body.cliente

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

        console.log(ventaDatos)
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

async function crearFacturaAPI(body) {
    try {   

        const cliente = await Cliente.findById(body.cliente.id);

        let singlePaymentMethod = null;

        if (body.formasDePago.length === 1 && body.formasDePago[0].forma !== 'electronic-wallet') {
            // Si hay solo una forma de pago y no es monedero, asigna la forma a singlePaymentMethod
            if(body.formasDePago[0].forma == 'cash'){
                singlePaymentMethod = '01';
            }
            if(body.formasDePago[0].forma == 'transfer'){
                singlePaymentMethod = '03';
            }
            if(body.formasDePago[0].forma == 'credit-card'){
                singlePaymentMethod = '04';
            }
            if(body.formasDePago[0].forma == 'debit-card'){
                singlePaymentMethod = '28';
            }
        } else {
            // Si hay más de una forma de pago o es monedero, asigna null
            singlePaymentMethod == '99';
        }

        let items = body.productos;

        const transformedItems = items.map(item => ({   
            quantity: item.cantidad,
            product: {
                description: item.nombre,
                product_key : item.product_key,
                price: item.precioConIva,
                tax_included: true,
                sku: item.reference
            }
        }));

        const invoice = await facturapi.invoices.create({
        //customer_id : cliente.facturapi,
        customer : cliente.idFacApi,
        items: transformedItems,
        payment_form: singlePaymentMethod,
        use: body.usoCFDI,
        payment_method: 'PUE',
        });

        console.log(invoice)

        // Si todo sale bien, devolver status 200 y los datos de la factura
        return { statusCode: 200, invoice };


    } catch (err) {
        console.log(err)
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