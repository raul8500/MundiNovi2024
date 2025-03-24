const Producto = require('../../schemas/productosSchema/productosSchema');
const Sucursal = require('../../schemas/sucursalSchema/sucursalSchema');
const Preciador = require('../../schemas/preciador/preciadorSchema');
const mongoose = require('mongoose');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const bwipjs = require('bwip-js');


const Linea = require('../../schemas/productosSchema/complementosSchema/lineaSchema');
const Departamento = require('../../schemas/productosSchema/complementosSchema/departamentoSchema');
const Marca = require('../../schemas/productosSchema/complementosSchema/marcaSchema');
const Grupo = require('../../schemas/productosSchema/complementosSchema/grupoSchema');

//Cambiar de cuenta a la que se usara siempre
exports.createProductFromExcel = async (req, res) => {
    const filePath = path.join(__dirname, '../../archivos', '20244.xlsx');
    try {
        // Cargar el archivo Excel
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        for (const row of jsonData) {
            const {
                type,
                reference,
                esActivo,
                codigoBarra,
                name,
                productKey,
                description,
                inventory,
                tiempoSurtido,
                controlAlmacen,
                volumen,
                peso,
                // Datos financieros
                costo,
                ultimoCosto,
                costoPromedio,
                unidadEmpaque,

                precio1,
                porcentajePrecio1,
                rangoInicial1,
                rangoFinal1,
                precio2,
                porcentajePrecio2,
                rangoInicial2,
                rangoFinal2,
                precio3,
                porcentajePrecio3,
                rangoInicial3,
                rangoFinal3,
                precio4,
                porcentajePrecio4,
                rangoInicial4,
                rangoFinal4,
                precio5,
                porcentajePrecio5,
                rangoInicial5,
                rangoFinal5,
                precio6,
                porcentajePrecio6,
                rangoInicial6,
                rangoFinal6,
                precio7,
                porcentajePrecio7,
                rangoInicial7,
                rangoFinal7,
                precio8,
                porcentajePrecio8,
                rangoInicial8,
                rangoFinal8,
                precio9,
                porcentajePrecio9,
                rangoInicial9,
                rangoFinal9,
                precio10,
                porcentajePrecio10,
                rangoInicial10,
                rangoFinal10,
                // Precios e impuestos
                linea,
                departamento,
                grupo,
                marca,
                tax,
                esKit,
                esGrupoProductos,
                esVisible,
                kitProducto,
                GrupoProducto
            } = row;

            const productoAlegra = {
                name: name ?? null,
                description: description ?? null,
                reference: reference ?? null,
                price: [{
                    idPriceList: '1',
                    price: precio1
                }],
                inventory: {
                    unit: inventory ?? null,
                },
                tax: [{
                    id: '1' ?? null,
                    name: 'IVA' ?? null,
                    percentage: 16.00 ?? null,
                    status: 'active' ?? null,
                    type: 'general' ?? null,
                }],
                productKey: productKey ?? null,
                type: type ?? null,
            };

            console.log(productoAlegra)

            const options = {
                method: 'POST',
                url: 'https://api.alegra.com/api/v1/items',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    authorization: 'Basic bG9wZXpqbzI5OUBnbWFpbC5jb206MDNmZjVkNjMwZjRhNzk2YmZmZjA='
                },
                body: productoAlegra,
                json: true,
            };

            request(options, async function (error, response, body) {
                if (error) {
                    return res.status(500).json({ error: 'Error al comunicarse con la API de Alegra' });
                }

                if (response.statusCode === 200 || response.statusCode === 201) {
                    const idAlegra = body.id;

                    const productData = {
                        type: type ?? null,
                        reference: reference ?? null,
                        esActivo: esActivo ?? null,
                        codigoBarra: codigoBarra ?? null,
                        name: name ?? null,
                        productKey: productKey ?? null,
                        description: description ?? null,
                        inventory: {
                            unit: inventory ?? null,
                        },
                        tiempoSurtido: tiempoSurtido ?? null,
                        controlAlmacen: controlAlmacen ?? null,
                        volumen: volumen ?? null,
                        peso: peso ?? null,
                        datosFinancieros: {
                            costo: costo ?? null,
                            ultimoCosto: ultimoCosto ?? null,
                            costoPromedio: costoPromedio ?? null,
                            unidadEmpaque: unidadEmpaque ?? null,
                            precio1: precio1 ?? null,
                            precio2: precio2 ?? null,
                            precio3: precio3 ?? null,
                            precio4: precio4 ?? null,
                            precio5: precio5 ?? null,
                            precio6: precio6 ?? null,
                            precio7: precio7 ?? null,
                            precio8: precio8 ?? null,
                            precio9: precio9 ?? null,
                            precio10: precio10 ?? null,
                            porcentajePrecio1: porcentajePrecio1 ?? null,
                            porcentajePrecio2: porcentajePrecio2 ?? null,
                            porcentajePrecio3: porcentajePrecio3 ?? null,
                            porcentajePrecio4: porcentajePrecio4 ?? null,
                            porcentajePrecio5: porcentajePrecio5 ?? null,
                            porcentajePrecio6: porcentajePrecio6 ?? null,
                            porcentajePrecio7: porcentajePrecio7 ?? null,
                            porcentajePrecio8: porcentajePrecio8 ?? null,
                            porcentajePrecio9: porcentajePrecio9 ?? null,
                            porcentajePrecio10: porcentajePrecio10 ?? null,
                            rangoInicial1: rangoInicial1 ?? null,
                            rangoInicial2: rangoInicial2 ?? null,
                            rangoInicial3: rangoInicial3 ?? null,
                            rangoInicial4: rangoInicial4 ?? null,
                            rangoInicial5: rangoInicial5 ?? null,
                            rangoInicial6: rangoInicial6 ?? null,
                            rangoInicial7: rangoInicial7 ?? null,
                            rangoInicial8: rangoInicial8 ?? null,
                            rangoInicial9: rangoInicial9 ?? null,
                            rangoInicial10: rangoInicial10 ?? null,
                            rangoFinal1: rangoFinal1 ?? null,
                            rangoFinal2: rangoFinal2 ?? null,
                            rangoFinal3: rangoFinal3 ?? null,
                            rangoFinal4: rangoFinal4 ?? null,
                            rangoFinal5: rangoFinal5 ?? null,
                            rangoFinal6: rangoFinal6 ?? null,
                            rangoFinal7: rangoFinal7 ?? null,
                            rangoFinal8: rangoFinal8 ?? null,
                            rangoFinal9: rangoFinal9 ?? null,
                            rangoFinal10: rangoFinal10 ?? null,
                        },
                        price: {
                            idPriceList: '1' ?? null,
                            price: precio1 ?? null,
                        } ?? [],
                        linea: linea ?? null,
                        departamento: departamento ?? null,
                        marca: marca ?? null,
                        grupo: grupo ?? null,
                        tax: {
                            id: '1' ?? null,
                            name: 'IVA' ?? null,
                            percentage: tax ?? null,
                            status: 'active' ?? null,
                            type: 'general' ?? null,
                        } ?? [],
                        esKit: esKit === 'true' ? true : esKit === 'false' ? false : null,
                        esGrupoProductos: esGrupoProductos === 'true' ? true : esGrupoProductos === 'false' ? false : null,
                        esVisible: esVisible === 'true' ? true : esVisible === 'false' ? false : null,
                        kitProducto: kitProducto?.map(k => ({
                            producto: k.producto ?? null,
                            cantidad: k.cantidad ?? null,
                        })) ?? [],
                        GrupoProducto: GrupoProducto?.map(g => ({
                            producto: g.producto ?? null,
                            cantidad: g.cantidad ?? null,
                        })) ?? [],
                        idAlegra: idAlegra ?? null,
                    };

                    const newProduct = new Producto(productData);

                    try {
                        const savedProduct = await newProduct.save();
                        console.log('Producto guardado exitosamente:', savedProduct.name);
                    } catch (dbError) {
                        console.error('Error al guardar el producto en la base de datos:', dbError);
                    }
                } else {
                    console.error('Error al crear el producto en Alegra:', response.statusCode, body);
                }
            });
        }

        res.status(201).json({
            message: 'Productos procesados desde el archivo Excel y enviados a la API de Alegra',
        });
    } catch (error) {
        console.error('Error al procesar el archivo Excel:', error);
        res.status(500).json({ error: 'Error al procesar el archivo Excel' });
    }
};

exports.createProduct = async (req, res) => {
    try {
  
        const productoAlegra = {
            name: req.body.generales.nombre ?? null,
            description: req.body.generales.descripcion ?? null,
            reference: req.body.generales.clave ?? null,
            price: req.body.datosFinancieros.precio1,
            inventory: {
                unit: 'H87'
            },
            tax: [{
                id: "1",
                name: "IVA",
                percentage: "16.00",
                status: "active",
                type: "general",
            }],
            productKey: req.body.generales.claveSAT ?? null,
            type: 'product'
        };

      const options = {
        method: 'POST',
        url: 'https://api.alegra.com/api/v1/items',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: 'Basic eW9zZWxpbmRsZ2FyemFAb3V0bG9vay5jb206ZWU5YmUwNjE4MGNmYWYzOGRkMzQ='
        },
        body: productoAlegra,
        json: true,
      };
  
      request(options, async function (error, response, body) {
        if (error) {
          return res.status(500).json({ error: 'Error al comunicarse con la API de Alegra' });
        }

        if (response.statusCode === 200 || response.statusCode === 201) {
            const idAlegra = body.id;

            console.log(idAlegra)
        /*


            const productData = {
                type: req.body.type ?? null,
                reference: req.body.reference ?? null,
                esActivo: req.body.esActivo ?? null,
                codigoBarra: req.body.codigoBarra ?? null,
                name: req.body.name ?? null,
                productKey: req.body.productKey ?? null,
                description: req.body.description ?? null,
                inventory: {
                    unit: req.body.inventory?.unit ?? null,
                },
                tiempoSurtido: req.body.tiempoSurtido ?? null,
                controlAlmacen: req.body.controlAlmacen ?? null,
                volumen: req.body.volumen ?? null,
                peso: req.body.peso ?? null,
                datosFinancieros: {
                    costo: req.body.datosFinancieros?.costo ?? null,
                    ultimoCosto: req.body.datosFinancieros?.ultimoCosto ?? null,
                    costoPromedio: req.body.datosFinancieros?.costoPromedio ?? null,
                    unidadEmpaque: req.body.datosFinancieros?.unidadEmpaque ?? null,
                    precio1: req.body.datosFinancieros?.precio1 ?? null,
                    precio2: req.body.datosFinancieros?.precio2 ?? null,
                    precio3: req.body.datosFinancieros?.precio3 ?? null,
                    precio4: req.body.datosFinancieros?.precio4 ?? null,
                    precio5: req.body.datosFinancieros?.precio5 ?? null,
                    precio6: req.body.datosFinancieros?.precio6 ?? null,
                    precio7: req.body.datosFinancieros?.precio7 ?? null,
                    precio8: req.body.datosFinancieros?.precio8 ?? null,
                    precio9: req.body.datosFinancieros?.precio9 ?? null,
                    precio10: req.body.datosFinancieros?.precio10 ?? null,
                    porcentajePrecio1: req.body.datosFinancieros?.porcentajePrecio1 ?? null,
                    porcentajePrecio2: req.body.datosFinancieros?.porcentajePrecio2 ?? null,
                    porcentajePrecio3: req.body.datosFinancieros?.porcentajePrecio3 ?? null,
                    porcentajePrecio4: req.body.datosFinancieros?.porcentajePrecio4 ?? null,
                    porcentajePrecio5: req.body.datosFinancieros?.porcentajePrecio5 ?? null,
                    porcentajePrecio6: req.body.datosFinancieros?.porcentajePrecio6 ?? null,
                    porcentajePrecio7: req.body.datosFinancieros?.porcentajePrecio7 ?? null,
                    porcentajePrecio8: req.body.datosFinancieros?.porcentajePrecio8 ?? null,
                    porcentajePrecio9: req.body.datosFinancieros?.porcentajePrecio9 ?? null,
                    porcentajePrecio10: req.body.datosFinancieros?.porcentajePrecio10 ?? null,
                    rangoInicial1: req.body.datosFinancieros?.rangoInicial1 ?? null,
                    rangoInicial2: req.body.datosFinancieros?.rangoInicial2 ?? null,
                    rangoInicial3: req.body.datosFinancieros?.rangoInicial3 ?? null,
                    rangoInicial4: req.body.datosFinancieros?.rangoInicial4 ?? null,
                    rangoInicial5: req.body.datosFinancieros?.rangoInicial5 ?? null,
                    rangoInicial6: req.body.datosFinancieros?.rangoInicial6 ?? null,
                    rangoInicial7: req.body.datosFinancieros?.rangoInicial7 ?? null,
                    rangoInicial8: req.body.datosFinancieros?.rangoInicial8 ?? null,
                    rangoInicial9: req.body.datosFinancieros?.rangoInicial9 ?? null,
                    rangoInicial10: req.body.datosFinancieros?.rangoInicial10 ?? null,
                    rangoFinal1: req.body.datosFinancieros?.rangoFinal1 ?? null,
                    rangoFinal2: req.body.datosFinancieros?.rangoFinal2 ?? null,
                    rangoFinal3: req.body.datosFinancieros?.rangoFinal3 ?? null,
                    rangoFinal4: req.body.datosFinancieros?.rangoFinal4 ?? null,
                    rangoFinal5: req.body.datosFinancieros?.rangoFinal5 ?? null,
                    rangoFinal6: req.body.datosFinancieros?.rangoFinal6 ?? null,
                    rangoFinal7: req.body.datosFinancieros?.rangoFinal7 ?? null,
                    rangoFinal8: req.body.datosFinancieros?.rangoFinal8 ?? null,
                    rangoFinal9: req.body.datosFinancieros?.rangoFinal9 ?? null,
                    rangoFinal10: req.body.datosFinancieros?.rangoFinal10 ?? null,
                },
                price: req.body.price?.map(p => ({
                    idPriceList: p.idPriceList ?? null,
                    price: p.price ?? null,
                })) ?? [],
                linea: req.body.linea === '' ? null :  req.body.linea,
                departamento: req.body.departamento === '' ? null :  req.body.departamento,
                marca: req.body.marca === '' ? null : req.body.marca,
                grupo: req.body.grupo === '' ? null :  req.body.grupo,
                tax: req.body.tax?.map(t => ({
                    id: t.id ?? null,
                    name: t.name ?? null,
                    percentage: t.percentage ?? null,
                    status: t.status ?? null,
                    type: t.type ?? null,
                })) ?? [],
                esKit: req.body.esKit ?? null,
                esGrupoProductos: req.body.esGrupoProductos ?? null,
                esVisible: req.body.esVisible ?? null,
                kitProducto: req.body.kitProducto?.map(k => ({
                    producto: k.id ?? null,
                    cantidad: k.cantidad ?? null,
                })) ?? [],
                GrupoProducto: req.body.GrupoProducto?.map(g => ({
                    producto: g.producto ?? null,
                    cantidad: g.cantidad ?? null,
                })) ?? [],
                idAlegra: idAlegra ?? null,
            };

            const newProduct = new Producto(productData);
  
            try {
                const savedProduct = await newProduct.save();
                res.status(201).json({
                    message: 'Producto creado y guardado exitosamente',
                    alegraResponse: body,
                    savedProduct: savedProduct,
                });
            } catch (dbError) {
                console.log(dbError)
                res.status(500).json({ error: 'Error al guardar el producto en la base de datos' });
            }

            */
        } else {
          res.status(response.statusCode).json(body);
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el producto' });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        // Obtiene todos los productos de la base de datos
        const products = await Producto.find({});

        // Crea una lista de promesas para obtener información adicional de las colecciones relacionadas
        const productsWithDetails = await Promise.all(products.map(async product => {
            const productDetails = product.toObject(); // Convertir el documento a un objeto

            // Cargar información adicional si existen IDs
            if (product.linea) {
                productDetails.linea = await Linea.findById(product.linea).exec();
            }
            if (product.departamento) {
                productDetails.departamento = await Departamento.findById(product.departamento).exec();
            }
            if (product.marca) {
                productDetails.marca = await Marca.findById(product.marca).exec();
            }
            if (product.grupo) {
                productDetails.grupo = await Grupo.findById(product.grupo).exec();
            }

            return productDetails;
        }));

        // Enviar respuesta con los productos y sus detalles
        res.status(200).json({
            message: 'Productos obtenidos exitosamente',
            products: productsWithDetails,
        });
    } catch (error) {
        // Maneja errores y envía una respuesta adecuada
        res.status(500).json({ error: 'Error al obtener los productos de la base de datos' });
    }
};

exports.updateProductPrice = async (req, res) => {
    try {
        const { id } = req.params; // El _id del producto viene en los parámetros de la URL
        const { newPrice, codigoBarra } = req.body; // El nuevo precio y el código de barras vienen en el cuerpo de la solicitud

        // Verificar si se recibió el nuevo precio
        if (newPrice === undefined) {
            return res.status(400).json({ error: 'Falta el nuevo precio. Por favor, proporciona el nuevo precio.' });
        }

        // Actualizar tanto el precio como el código de barras
        const updatedProduct = await Producto.findByIdAndUpdate(
            id, // El _id del producto que deseas actualizar
            { 
                'datosFinancieros.precio1': newPrice, // Actualizar el campo `precio1` dentro de `datosFinancieros`
                codigoBarra: codigoBarra // Actualizar el campo `codigoBarra`
            }, 
            { new: true } // Para devolver el documento actualizado
        );

        // Verificar si el producto fue encontrado y actualizado
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Obtener todas las sucursales para añadir al preciador
        const sucursales = await Sucursal.find(); // Asumimos que tienes una colección de sucursales

        // Crear o actualizar el registro en Preciador para este producto
        await Preciador.findOneAndUpdate(
            { productoId: updatedProduct._id }, // Usamos el ID del producto actualizado
            { sucursalesPendientes: sucursales.map(sucursal => sucursal._id) }, // Todas las sucursales deben imprimir
            { upsert: true, new: true } // Si no existe el registro, lo crea
        );

        // Enviar la respuesta con el producto actualizado
        res.status(200).json({
            message: 'Precio y código de barras del producto actualizados exitosamente y agregado al preciador',
            product: updatedProduct
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params; // El _id del producto viene en los parámetros de la URL

        // Buscar el producto por su _id
        const product = await Producto.findById(id);

        // Verificar si el producto fue encontrado
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Convertir el documento del producto a un objeto
        const productDetails = product.toObject();

        // Enviar respuesta con el producto y sus detalles
        res.status(200).json({
            message: 'Producto obtenido exitosamente',
            product: productDetails
        });
    } catch (error) {
        // Maneja errores y envía una respuesta adecuada
        res.status(500).json({ error: 'Error al obtener el producto de la base de datos' });
    }
};

exports.getPreciadorBySucursal = async (req, res) => {
    try {
        const { sucursalId } = req.params;

        // Convertir sucursalId a ObjectId usando 'new'
        const sucursalObjectId = new mongoose.Types.ObjectId(sucursalId);

        // Buscar productos pendientes para esta sucursal
        const productosPendientes = await Preciador.find({
            sucursalesPendientes: sucursalObjectId
        }).populate('productoId');

        if (!productosPendientes.length) {
            return res.status(200).json({ message: 'No hay productos pendientes de impresión para esta sucursal' });
        }

        res.status(200).json({
            message: 'Productos pendientes obtenidos exitosamente',
            productos: productosPendientes.map(p => p.productoId)
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener los productos pendientes de impresión' });
    }
};

exports.marcarProductoImpreso = async (req, res) => {
    try {
        const { productos, sucursalId } = req.body; // Productos seleccionados y ID de la sucursal

        // Validar que se hayan enviado los productos
        if (!productos || productos.length === 0) {
            return res.status(400).json({ message: 'El campo "productos" es requerido y debe contener al menos un producto.' });
        }

        // Crear el documento PDF con un margen superior reducido
        const doc = new PDFDocument({ size: [230, 330], layout: 'landscape', margins: { top: 30, left: 30, right: 30, bottom: 10 } }); // Tamaño de la página y ajuste de márgenes
        const nombreArchivo = path.join(__dirname, `../../public/img/archivos/precios_productos.pdf`);
        const nombreArchivoPublico = '/img/archivos/precios_productos.pdf'; // Ruta pública para el archivo generado
        const writeStream = fs.createWriteStream(nombreArchivo);
        doc.pipe(writeStream);

        // Iterar sobre los productos
        for (const producto of productos) {
            const productoDb = await Producto.findById(producto._id); // Obtener el producto de la BD por su ID

            if (!productoDb) {
                return res.status(404).json({ message: `Producto con ID ${producto._id} no encontrado.` });
            }

            // Generar una página por cada cantidad de impresión para cada producto
            for (let i = 0; i < producto.cantidad; i++) {
                if (i > 0 || productos.indexOf(producto) > 0) {
                    doc.addPage();
                }

                // Nombre del producto centrado
                doc.fontSize(14).text(productoDb.name, {
                    align: 'center'
                });

                // Referencia del producto centrado
                doc.fontSize(10).text(`${productoDb.reference}  `, { align: 'center', continued: true })
                    .fontSize(7).text(`   $   `, { continued: true })  // Agregamos un espacio después del símbolo de dólar
                    .fontSize(12).text(`${productoDb.datosFinancieros.precio1}`, { continued: false }); // Continuamos con el precio



                // Promoción centrada
                doc.fontSize(18).text(`Promoción x 2:`, {
                    align: 'center',
                });

                            // Comprobamos que los datos financieros existan y sean válidos
                if (!productoDb.datosFinancieros || !productoDb.datosFinancieros.precio3) {
                    throw new Error('El precio del producto no está disponible.');
                }

                // Obtenemos el precio2 y nos aseguramos de que tenga siempre dos decimales
                let precio2 = parseFloat(productoDb.datosFinancieros.precio2).toFixed(2);  // Aseguramos que el precio tiene dos decimales
                const [precioEntero, precioDecimal] = precio2.split('.');  // Separamos los enteros de los decimales

                // Obtener el ancho del texto para centrar manualmente
                const textWidthDollar = doc.fontSize(10).widthOfString('$ ');
                const textWidthPrice = doc.fontSize(32).widthOfString(precioEntero);
                const textWidthDecimals = doc.fontSize(14).widthOfString(`.${precioDecimal}`);
                const textWidthCu = doc.fontSize(14).widthOfString(' c/u');

                // Verificamos que ninguno de los anchos sea NaN
                if (isNaN(textWidthDollar) || isNaN(textWidthPrice) || isNaN(textWidthDecimals) || isNaN(textWidthCu)) {
                    throw new Error('Error en el cálculo de los anchos del texto.');
                }

                // Sumar el ancho total del texto
                const totalTextWidth = textWidthDollar + textWidthPrice + textWidthDecimals + textWidthCu;

                // Comprobamos que la página tiene un ancho definido y realizamos el cálculo de centrado
                const pageWidth = (doc.page && doc.page.width) ? doc.page.width - doc.page.margins.left - doc.page.margins.right : 230; // Si no existe, usar un valor por defecto
                const xPosition = (pageWidth - totalTextWidth) / 2;

                // Dibujar el texto centrándolo manualmente
                doc.fontSize(10).text('            $ ', xPosition, doc.y, { continued: true })  // Símbolo de dólar más pequeño
                    .fontSize(34).text(precioEntero, { continued: true })  // Precio en tamaño grande (parte entera)
                    .fontSize(14).text(`.${precioDecimal}`, { continued: true })  // Decimales más pequeños
                    .fontSize(14).text(' c/u', { continued: false });  // Texto "c/u" más pequeño


                doc.moveDown(.5); // Ajusta el número si deseas más espacio, 1 es el predeterminado



                // Generar el código de barras basado en la referencia del producto
                const barcodeBuffer = await bwipjs.toBuffer({
                    bcid: 'code128',
                    text: productoDb.reference,
                    scale: 4,
                    height: 12,
                });

                // Añadir el código de barras centrado en el PDF
                doc.image(barcodeBuffer, {
                    fit: [135, 65],
                    align: 'center', // Centrando el código de barras
                    valign: 'center' // Alineación vertical
                });

                                
                // Espacio después del código de barras
                doc.moveDown(3.5);

                // Obtener el ancho total del texto del nombre del producto para alinear los rangos con él
                const textWidthProductName = doc.fontSize(14).widthOfString(productoDb.name);

                // Calculamos la posición x basada en el centrado del nombre del producto
                const xPositionRangos = (pageWidth - textWidthProductName) / 2;  // Usamos la misma variable pageWidth previamente declarada

                // Dibujar los 4 rangos en una sola línea con fuente pequeña, alineados con el nombre del producto
                doc.fontSize(6).text(`                       ${productoDb.datosFinancieros.rangoInicial3}.${productoDb.datosFinancieros.precio3} `, { continued: true });
                doc.fontSize(6).text(`             ${productoDb.datosFinancieros.rangoInicial4}.${productoDb.datosFinancieros.precio4} `, { continued: false });


            }

            // Marcar el producto como impreso en el preciador para la sucursal
            const preciador = await Preciador.findOne({ productoId: producto._id });

            if (preciador) {
                preciador.sucursalesPendientes = preciador.sucursalesPendientes.filter(
                    sucursal => sucursal.toString() !== sucursalId
                );
                if (!preciador.sucursalesPendientes.length) {
                    await Preciador.findByIdAndDelete(preciador._id);
                } else {
                    await preciador.save();
                }
            }
        }

        // Finalizar el documento PDF
        doc.end();

        // Enviar respuesta al frontend
        writeStream.on('finish', () => {
            res.status(200).json({
                message: 'PDF generado y productos marcados como impresos.',
                archivo: nombreArchivoPublico
            });
        });

        writeStream.on('error', (err) => {
            console.error('Error al generar el PDF: ', err);
            res.status(500).json({ message: 'Error al generar el PDF.', error: err });
        });
    } catch (error) {
        console.error('Error en la generación del PDF de precios:', error);
        res.status(500).json({ message: 'Error en la generación del PDF de precios.', error });
    }
};

exports.exportarProductosAExcel = async (req, res) => {
    try {
        // Obtener todos los productos desde la base de datos
        const productos = await Producto.find().lean();

        if (!productos || productos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos para exportar.' });
        }

        // Crear una matriz con los datos formateados para el Excel
        const datosExcel = productos.map(producto => ({
            Tipo: producto.type || '',
            Referencia: producto.reference || '',
            Activo: producto.esActivo ? 'Sí' : 'No',
            'Código de Barra': producto.codigoBarra || '',
            Nombre: producto.name || '',
            'Clave del Producto': producto.productKey || '',
            Descripción: producto.description || '',
            'Unidad de Inventario': producto.inventory?.unit || '',
            'Tiempo de Surtido': producto.tiempoSurtido || '',
            'Control de Almacén': producto.controlAlmacen || '',
            Volumen: producto.volumen || '',
            Peso: producto.peso || '',
            'Costo': producto.datosFinancieros?.costo || '',
            'Último Costo': producto.datosFinancieros?.ultimoCosto || '',
            'Costo Promedio': producto.datosFinancieros?.costoPromedio || '',
            'Unidad de Empaque': producto.datosFinancieros?.unidadEmpaque || '',
            Precio1: producto.datosFinancieros?.precio1 || '',
            Precio2: producto.datosFinancieros?.precio2 || '',
            Precio3: producto.datosFinancieros?.precio3 || '',
            Precio4: producto.datosFinancieros?.precio4 || '',
            Precio5: producto.datosFinancieros?.precio5 || '',
            Precio6: producto.datosFinancieros?.precio6 || '',
            Precio7: producto.datosFinancieros?.precio7 || '',
            Precio8: producto.datosFinancieros?.precio8 || '',
            Precio9: producto.datosFinancieros?.precio9 || '',
            Precio10: producto.datosFinancieros?.precio10 || '',
            'Porcentaje Precio 1': producto.datosFinancieros?.porcentajePrecio1 || '',
            'Porcentaje Precio 2': producto.datosFinancieros?.porcentajePrecio2 || '',
            'Porcentaje Precio 3': producto.datosFinancieros?.porcentajePrecio3 || '',
            'Porcentaje Precio 4': producto.datosFinancieros?.porcentajePrecio4 || '',
            'Porcentaje Precio 5': producto.datosFinancieros?.porcentajePrecio5 || '',
            'Porcentaje Precio 6': producto.datosFinancieros?.porcentajePrecio6 || '',
            'Porcentaje Precio 7': producto.datosFinancieros?.porcentajePrecio7 || '',
            'Porcentaje Precio 8': producto.datosFinancieros?.porcentajePrecio8 || '',
            'Porcentaje Precio 9': producto.datosFinancieros?.porcentajePrecio9 || '',
            'Porcentaje Precio 10': producto.datosFinancieros?.porcentajePrecio10 || '',
            'Rango Inicial 1': producto.datosFinancieros?.rangoInicial1 || '',
            'Rango Final 1': producto.datosFinancieros?.rangoFinal1 || '',
            'Rango Inicial 2': producto.datosFinancieros?.rangoInicial2 || '',
            'Rango Final 2': producto.datosFinancieros?.rangoFinal2 || '',
            'Rango Inicial 3': producto.datosFinancieros?.rangoInicial3 || '',
            'Rango Final 3': producto.datosFinancieros?.rangoFinal3 || '',
            'Porcentaje Monedero 1': producto.datosFinancieros?.porcentajeMonedero1 || '',
            'Porcentaje Monedero 2': producto.datosFinancieros?.porcentajeMonedero2 || '',
            'Porcentaje Monedero 3': producto.datosFinancieros?.porcentajeMonedero3 || '',
            'Porcentaje Monedero 4': producto.datosFinancieros?.porcentajeMonedero4 || '',
            'Porcentaje Monedero 5': producto.datosFinancieros?.porcentajeMonedero5 || '',
            'Porcentaje Monedero 6': producto.datosFinancieros?.porcentajeMonedero6 || '',
            'Porcentaje Monedero 7': producto.datosFinancieros?.porcentajeMonedero7 || '',
            'Porcentaje Monedero 8': producto.datosFinancieros?.porcentajeMonedero8 || '',
            'Porcentaje Monedero 9': producto.datosFinancieros?.porcentajeMonedero9 || '',
            'Porcentaje Monedero 10': producto.datosFinancieros?.porcentajeMonedero10 || '',
            Línea: producto.linea?.toString() || '',
            Departamento: producto.departamento?.toString() || '',
            Marca: producto.marca?.toString() || '',
            Grupo: producto.grupo?.toString() || '',
            'ID Alegra': producto.idAlegra || '',
            'Es Kit': producto.esKit ? 'Sí' : 'No',
            'Es Grupo de Productos': producto.esGrupoProductos ? 'Sí' : 'No',
        }));

        // Crear un libro y una hoja de Excel
        const libro = xlsx.utils.book_new();
        const hoja = xlsx.utils.json_to_sheet(datosExcel);

        // Agregar la hoja al libro
        xlsx.utils.book_append_sheet(libro, hoja, 'Productos');

        // Generar el archivo Excel
        const nombreArchivo = path.join(__dirname, '../../archivos', 'productos.xlsx');
        xlsx.writeFile(libro, nombreArchivo);

        // Enviar el archivo al cliente
        res.download(nombreArchivo, 'productos.xlsx', (err) => {
            if (err) {
                console.error('Error al enviar el archivo:', err);
                return res.status(500).json({ message: 'Error al generar o enviar el archivo Excel.' });
            }

            // Eliminar el archivo después de enviarlo
            fs.unlinkSync(nombreArchivo);
        });
    } catch (error) {
        console.error('Error al exportar los productos:', error);
        res.status(500).json({ message: 'Error al exportar los productos a Excel.' });
    }
};

const Kardex = require('../../schemas/kardexSchema/kardexSchema'); // Modelo de Kardex



exports.obtenerExistenciaPorProducto = async (req, res) => {
    try {
        const { id } = req.params; // ID del producto recibido en la URL

        // 1. Buscar el producto en la base de datos
        const producto = await Producto.findById(id, 'reference name');
        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // 2. Obtener la última existencia del producto en cada sucursal desde Kardex
        const registrosPorSucursal = await Kardex.aggregate([
            { $match: { reference: producto.reference } }, // Filtrar por producto
            { $sort: { fecha: -1 } }, // Ordenar por fecha descendente
            {
                $group: {
                    _id: "$sucursal",
                    existencia: { $first: "$existencia" } // Última existencia registrada
                }
            },
            {
                $lookup: {
                    from: "sucursals", // Nombre de la colección de sucursales en MongoDB
                    localField: "_id",
                    foreignField: "_id",
                    as: "sucursalInfo"
                }
            },
            {
                $unwind: { path: "$sucursalInfo", preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    _id: 0,
                    sucursal: "$sucursalInfo.nombre", // Nombre de la sucursal
                    existencia: 1
                }
            }
        ]);

        // 3. Si no hay registros en Kardex, devolver 0 en todas las sucursales
        const sucursalesConExistencia = registrosPorSucursal.map(registro => ({
            sucursal: registro.sucursal || "Desconocida", // Si no tiene nombre, poner "Desconocida"
            existencia: registro.existencia ?? 0
        }));

        res.json({
            reference: producto.reference,
            name: producto.name,
            sucursales: sucursalesConExistencia
        });

    } catch (error) {
        console.error("Error al obtener existencia del producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};























