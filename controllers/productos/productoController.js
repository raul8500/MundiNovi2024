//const alegra = require('../../.api/apis/alegra-productos');
const Product = require('../../schemas/productosSchema/productosSchema');
const xlsx = require('xlsx');
const fs = require('fs');
const Facturapi = require('facturapi').default;
const facturapi = new Facturapi('sk_test_GO8zw0Xo52mM1kgLW3a1Y8OydL9Nel4JBEZabDQ3Yv');
const Unidad = require('../../schemas/productosSchema/complementosSchema/unidadSchema'); // o la ruta real


exports.createProduct = async (req, res) => {
    try {
        console.log(req.body)

        const productoData = JSON.parse(req.body.producto); // 👈 parsear JSON enviado
        const facApiProduct = productoData.facApiProduct;
        const databaseProduct = productoData.product;
        

         // Obtener clave de unidad desde la base de datos
         const unidadDB = await Unidad.findById(databaseProduct.unidad);
         if (!unidadDB) {
             return res.status(400).json({ message: "Unidad no encontrada para crear en Facturapi" });
         }
 
         if (req.file) {
             databaseProduct.rutaImagen = `/img/productos/${req.file.filename}`;
         }
 
         // Crear producto en Facturapi
         const product = await facturapi.products.create({
             description: facApiProduct.description,
             product_key: facApiProduct.product_key,
             price: facApiProduct.price,
             tax_included: true,
             taxability: "02",
             taxes: [
                 { type: "IVA", rate: 0.16 }
             ],
             unit_key: unidadDB.claveUnidad,
             unit_name: unidadDB.nombre,
             sku: facApiProduct.sku
         });


        console.log("Producto creado en Fac Api:", product);


        // Guardar el producto en la base de datos (ejemplo usando Mongoose)
        const newProduct = new Product({
            idFacturApi: product.id,
            type: "product",
            reference: product.sku,
            esActivo: databaseProduct.estado,
            codigoBarra: databaseProduct.codigoBarra,
            name: product.unit_name,
            productKey: product.product_key,
            description: product.description,
            inventory: product.unit_key,
            tiempoSurtido: databaseProduct.datosFinancieros.tiempoSurtido,
            volumen: databaseProduct.datosFinancieros.volumen,
            peso: databaseProduct.datosFinancieros.peso,
            presentacion: databaseProduct.datosFinancieros.presentacion,
            datosFinancieros: {
                costo: databaseProduct.datosFinancieros.costo,
                ultimoCosto: databaseProduct.datosFinancieros.ultimoCosto,
                costoPromedio: databaseProduct.datosFinancieros.costoPromedio,
                numeroPrecioMaximo: databaseProduct.datosFinancieros.numeroPrecioMaximo,
                numeroPrecioMinimo: databaseProduct.datosFinancieros.numeroPrecioMinimo,
                precio1: databaseProduct.datosFinancieros.precio1,
                precio2: databaseProduct.datosFinancieros.precio2,
                precio3: databaseProduct.datosFinancieros.precio3,
                precio4: databaseProduct.datosFinancieros.precio4,
                precio5: databaseProduct.datosFinancieros.precio5,
                precio6: databaseProduct.datosFinancieros.precio6,
                precio7: databaseProduct.datosFinancieros.precio7,
                precio8: databaseProduct.datosFinancieros.precio8,
                precio9: databaseProduct.datosFinancieros.precio9,
                precio10: databaseProduct.datosFinancieros.precio10,
                porcentajePrecio1: databaseProduct.datosFinancieros.porcentajePrecio1,
                porcentajePrecio2: databaseProduct.datosFinancieros.porcentajePrecio2,
                porcentajePrecio3: databaseProduct.datosFinancieros.porcentajePrecio3,
                porcentajePrecio4: databaseProduct.datosFinancieros.porcentajePrecio4,
                porcentajePrecio5: databaseProduct.datosFinancieros.porcentajePrecio5,
                porcentajePrecio6: databaseProduct.datosFinancieros.porcentajePrecio6,
                porcentajePrecio7: databaseProduct.datosFinancieros.porcentajePrecio7,
                porcentajePrecio8: databaseProduct.datosFinancieros.porcentajePrecio8,
                porcentajePrecio9: databaseProduct.datosFinancieros.porcentajePrecio9,
                porcentajePrecio10: databaseProduct.datosFinancieros.porcentajePrecio10,
                rangoInicial1: databaseProduct.datosFinancieros.rangoInicial1,
                rangoInicial2: databaseProduct.datosFinancieros.rangoInicial2,
                rangoInicial3: databaseProduct.datosFinancieros.rangoInicial3,
                rangoInicial4: databaseProduct.datosFinancieros.rangoInicial4,
                rangoInicial5: databaseProduct.datosFinancieros.rangoInicial5,
                rangoInicial6: databaseProduct.datosFinancieros.rangoInicial6,
                rangoInicial7: databaseProduct.datosFinancieros.rangoInicial7,
                rangoInicial8: databaseProduct.datosFinancieros.rangoInicial8,
                rangoInicial9: databaseProduct.datosFinancieros.rangoInicial9,
                rangoInicial10: databaseProduct.datosFinancieros.rangoInicial10,
                rangoFinal1: databaseProduct.datosFinancieros.rangoFinal1,
                rangoFinal2: databaseProduct.datosFinancieros.rangoFinal2,
                rangoFinal3: databaseProduct.datosFinancieros.rangoFinal3,
                rangoFinal4: databaseProduct.datosFinancieros.rangoFinal4,
                rangoFinal5: databaseProduct.datosFinancieros.rangoFinal5,
                rangoFinal6: databaseProduct.datosFinancieros.rangoFinal6,
                rangoFinal7: databaseProduct.datosFinancieros.rangoFinal7,
                rangoFinal8: databaseProduct.datosFinancieros.rangoFinal8,
                rangoFinal9: databaseProduct.datosFinancieros.rangoFinal9,
                rangoFinal10: databaseProduct.datosFinancieros.rangoFinal10,
                porcentajeMonedero1: databaseProduct.datosFinancieros.porcentajeMonedero1,
                porcentajeMonedero2: databaseProduct.datosFinancieros.porcentajeMonedero2,
                porcentajeMonedero3: databaseProduct.datosFinancieros.porcentajeMonedero3,
                porcentajeMonedero4: databaseProduct.datosFinancieros.porcentajeMonedero4,
                porcentajeMonedero5: databaseProduct.datosFinancieros.porcentajeMonedero5,
                porcentajeMonedero6: databaseProduct.datosFinancieros.porcentajeMonedero6,
                porcentajeMonedero7: databaseProduct.datosFinancieros.porcentajeMonedero7,
                porcentajeMonedero8: databaseProduct.datosFinancieros.porcentajeMonedero8,
                porcentajeMonedero9: databaseProduct.datosFinancieros.porcentajeMonedero9,
                porcentajeMonedero10: databaseProduct.datosFinancieros.porcentajeMonedero10
            },
            rutaImagen: databaseProduct.rutaImagen,
            proveedor: databaseProduct.proveedor,
            esKit: databaseProduct.esKit,
            esGrupo: databaseProduct.esGrupo,
            productosAdicionales: databaseProduct.productosAdicionales,
            productosGrupo: databaseProduct.productosGrupo,
            productosKit: databaseProduct.productosKit,
            productosComplementarios: databaseProduct.productosComplementarios,
            categoria: databaseProduct.categoria,
            grupo: databaseProduct.grupo,
            marca: databaseProduct.marca,
            linea: databaseProduct.linea,
            departamento: databaseProduct.departamento,
            unidad: databaseProduct.unidad,
            impuesto: databaseProduct.impuesto,
        });

        await newProduct.save();

        res.status(201).json({
            message: "Producto creado correctamente",
            facApi: product,
            databaseProduct: newProduct
        });

    } catch (err) {
        console.error("Error al crear producto:", err);
        res.status(500).json({ message: "Error al crear el producto", error: err });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({})
            .populate('categoria')
            .populate('grupo')
            .populate('marca')
            .populate('linea')
            .populate('departamento')
            .populate('unidad')
            .populate('impuesto')
            .populate('proveedor')
            .populate('productosAdicionales')
            .populate('productosGrupo')
            .populate('productosKit')
            .populate('productosComplementarios');
        res.status(200).json({
            message: 'Productos obtenidos exitosamente',
            products,
        });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: 'Error al obtener los productos de la base de datos' });
    }
};

exports.loadProductsFromExcel = async (req, res) => {
    try {
        // Validar que haya un archivo
        if (!req.file) {
            return res.status(400).json({ message: "No se envió ningún archivo." });
        }

        // Log del archivo recibido
        console.log("Archivo recibido:", req.file.originalname, req.file.mimetype, req.file.size);

        // Validar tipo de archivo (opcional pero recomendable)
        if (
            !req.file.mimetype.includes("excel") &&
            !req.file.mimetype.includes("spreadsheetml")
        ) {
            return res.status(400).json({ message: "Tipo de archivo inválido. Se espera un archivo Excel." });
        }

        // Leer archivo desde disco
        const fileBuffer = fs.readFileSync(req.file.path);
        const workbook = xlsx.read(fileBuffer);

        // Verificar que tenga al menos una hoja
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
            return res.status(400).json({ message: "El archivo Excel no contiene hojas." });
        }

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const products = xlsx.utils.sheet_to_json(sheet);

        // Validar contenido
        if (!products.length) {
            return res.status(400).json({ message: "El archivo Excel está vacío o mal estructurado." });
        }

        // Guardar productos
        for (let product of products) {
            const newProduct = new Product({
                reference: product.reference,
                name: product.nombre,
                datosFinancieros: {
                    precio1: product.precio1,
                    precio2: product.precio2,
                    precio3: product.precio3,
                    precio4: product.precio4,
                    precio5: product.precio5,
                    precio6: product.precio6,
                    precio7: product.precio7,
                    precio8: product.precio8,
                    precio9: product.precio9,
                    precio10: product.precio10,
                    rangoInicial1: product.rangoInicial1,
                    rangoFinal1: product.rangoFinal1,
                    rangoInicial2: product.rangoInicial2,
                    rangoFinal2: product.rangoFinal2,
                    rangoInicial3: product.rangoInicial3,
                    rangoFinal3: product.rangoFinal3,
                    rangoInicial4: product.rangoInicial4,
                    rangoFinal4: product.rangoFinal4,
                    rangoInicial5: product.rangoInicial5,
                    rangoFinal5: product.rangoFinal5,
                    rangoInicial6: product.rangoInicial6,
                    rangoFinal6: product.rangoFinal6,
                    rangoInicial7: product.rangoInicial7,
                    rangoFinal7: product.rangoFinal7,
                    rangoInicial8: product.rangoInicial8,
                    rangoFinal8: product.rangoFinal8,
                    rangoInicial9: product.rangoInicial9,
                    rangoFinal9: product.rangoFinal9,
                    rangoInicial10: product.rangoInicial10,
                    rangoFinal10: product.rangoFinal10
                }
            });

            await newProduct.save();
            console.log(`Producto cargado: ${newProduct.name}`);
        }

        res.status(201).json({ message: "Productos cargados correctamente" });

    } catch (err) {
        console.error("Error al cargar productos desde Excel:", err);
        res.status(500).json({
            message: "Error al cargar los productos",
            error: err.message || err
        });
    }
};

exports.getProductById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const product = await Product.findById(id)
        .populate('categoria')
        .populate('grupo')
        .populate('marca')
        .populate('linea')
        .populate('departamento')
        .populate('unidad')
        .populate('impuesto')
        .populate('proveedor')
        .populate('productosAdicionales')
        .populate('productosGrupo')
        .populate('productosKit.id')
        .populate('productosComplementarios');
  
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
  
      res.status(200).json({
        message: 'Producto obtenido exitosamente',
        product,
      });
    } catch (error) {
      console.error("Error al obtener producto por ID:", error);
      res.status(500).json({ error: 'Error al obtener el producto de la base de datos' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const productoData = JSON.parse(req.body.producto);
        const databaseProduct = productoData.product;

        if (req.file) {
            databaseProduct.rutaImagen = `/img/productos/${req.file.filename}`;
        }

        // Buscar producto actual
        const existingProduct = await Product.findById(req.params.id);
        if (!existingProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

                // Obtener la unidad desde la base de datos usando su ID
        const unidadDB = await Unidad.findById(databaseProduct.unidad);

        if (!unidadDB) {
            return res.status(400).json({ message: "Unidad no encontrada para actualizar en Facturapi" });
        }

        const claveUnidad = unidadDB.claveUnidad; // Esto es lo que espera Facturapi como unit_key

        // Actualizar producto en Facturapi
        await facturapi.products.update(existingProduct.idFacturApi, {
            description: databaseProduct.description,
            product_key: databaseProduct.product_key,
            price: databaseProduct.datosFinancieros.precio1 || 0,
            tax_included: true,
            taxability: "02",
            taxes: [
                {
                    type: "IVA",
                    rate: 0.16
                }
            ],
            unit_key: claveUnidad,
            unit_name: unidadDB.nombre,
            sku: databaseProduct.sku
        });


        // Actualizar en MongoDB
        const update = {
            esActivo: databaseProduct.estado,
            codigoBarra: databaseProduct.codigoBarra,
            reference: databaseProduct.sku,
            name: databaseProduct.unit_name,
            productKey: databaseProduct.product_key,
            description: databaseProduct.description,
            inventory: databaseProduct.unidad,
            tiempoSurtido: databaseProduct.datosFinancieros.tiempoSurtido,
            volumen: databaseProduct.datosFinancieros.volumen,
            peso: databaseProduct.datosFinancieros.peso,
            presentacion: databaseProduct.datosFinancieros.presentacion,
            datosFinancieros: {
                ...databaseProduct.datosFinancieros
            },
            rutaImagen: databaseProduct.rutaImagen,
            proveedor: databaseProduct.proveedor,
            esKit: databaseProduct.esKit,
            esGrupo: databaseProduct.esGrupo,
            productosAdicionales: databaseProduct.productosAdicionales,
            productosGrupo: databaseProduct.productosGrupo,
            productosKit: databaseProduct.productosKit,
            productosComplementarios: databaseProduct.productosComplementarios,
            categoria: databaseProduct.categoria,
            grupo: databaseProduct.grupo,
            marca: databaseProduct.marca,
            linea: databaseProduct.linea,
            departamento: databaseProduct.departamento,
            unidad: databaseProduct.unidad,
            impuesto: databaseProduct.impuesto,
        };

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true }
        );

        res.status(200).json({
            message: "Producto actualizado correctamente",
            databaseProduct: updatedProduct
        });

    } catch (err) {
        console.error("Error al actualizar producto:", err);
        res.status(500).json({ message: "Error al actualizar el producto", error: err });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const producto = await Product.findById(id);

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Eliminar primero en Facturapi si tiene ID
        if (producto.idFacturApi) {
            try {
                await facturapi.products.del(producto.idFacturApi);
                console.log(`Producto eliminado de Facturapi: ${producto.idFacturApi}`);
            } catch (factApiErr) {
                console.warn('Advertencia: No se pudo eliminar de Facturapi', factApiErr.message);
                // No se lanza error si falla en Facturapi, solo se avisa
            }
        }

        // Eliminar en MongoDB
        await Product.findByIdAndDelete(id);

        res.status(200).json({ message: 'Producto eliminado correctamente' });

    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ message: 'Error al eliminar el producto', error });
    }
};


