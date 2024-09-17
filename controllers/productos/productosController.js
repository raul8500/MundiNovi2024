const Producto = require('../../schemas/productosSchema/productosSchema');
const request = require('request');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

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
        const {
            name,
            description,
            reference,
            price = [],
            inventory = {},
            tax = [],
            productKey,
            type,
        } = req.body;

  
        const productoAlegra = {
            name: name ?? null,
            description: description ?? null,
            reference: reference ?? null,
            price: price.map(p => ({
                idPriceList: p.idPriceList ?? null,
                price: p.price ?? null,
            })),
            inventory: {
                unit: inventory.unit ?? null,
            },
            tax: tax.map(t => ({
                id: t.id ?? null,
                name: t.name ?? null,
                percentage: t.percentage ?? null,
                status: t.status ?? null,
                type: t.type ?? null,
            })),
            productKey: productKey ?? null,
            type: type ?? null,
        };

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
        console.log(response.statusCode, body)
  
        if (response.statusCode === 200 || response.statusCode === 201) {
            const idAlegra = body.id;
  
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
