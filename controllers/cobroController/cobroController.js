const Producto = require('../../schemas/cobrosSchema/cobroSchema'); // Ajusta la ruta según sea necesario
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

const Venta = require('../../schemas/venta/ventaSchema');
const request = require('request');

exports.loadProductosFromFile = async (req, res) => {
    try {
        // Ruta del archivo específico
        const filePath = path.join(__dirname, '../../archivos', '20242.xlsx');
        
        // Verificar si el archivo existe
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Archivo no encontrado' });
        }

        // Leer el archivo Excel
        const workbook = XLSX.readFile(filePath);
        const sheet_name_list = workbook.SheetNames;
        const productosData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {
            header: [
                'clave', 'claveProveedor', 'codigoBarra', 'nombre', 'descripcion', 
                'tiempoSurtido', 'controlAlmacen', 'volumen', 'peso', 'costo', 
                'ultimoCosto', 'costoPromedio', 'unidadEntrada', 'unidadSalida', 
                'factorEntreUnidades', 'unidadEmpaque', 'lote', 'precio1', 
                'porcentajePrecio1', 'rangoInicial1', 'rangoFinal1', 'precio2', 
                'porcentajePrecio2', 'rangoInicial2', 'rangoFinal2', 'precio3', 
                'porcentajePrecio3', 'rangoInicial3', 'rangoFinal3', 'precio4', 
                'porcentajePrecio4', 'rangoInicial4', 'rangoFinal4', 'precio5', 
                'porcentajePrecio5', 'rangoInicial5', 'rangoFinal5', 'precio6', 
                'porcentajePrecio6', 'rangoInicial6', 'rangoFinal6', 'precio7', 
                'porcentajePrecio7', 'rangoInicial7', 'rangoFinal7', 'precio8', 
                'porcentajePrecio8', 'rangoInicial8', 'rangoFinal8', 'precio9', 
                'porcentajePrecio9', 'rangoInicial9', 'rangoFinal9', 'precio10', 
                'porcentajePrecio10', 'rangoInicial10', 'rangoFinal10', 'observaciones', 
                'linea', 'departamento', 'grupo', 'marca', 'impuesto', 'esKit', 
                'esGrupo', 'esVisible', 'presentacionProducto'
            ]
        });

        // Transformar los datos si es necesario
        const productosTransformados = productosData.map(producto => ({
            ...producto,
            controlAlmacen: producto.controlAlmacen === 1,  // Convertir a booleano
            esKit: producto.esKit === 'True',
            esGrupo: producto.esGrupo === 'True',
            esVisible: producto.esVisible === 'True',
            linea: null,  // Deberás mapear estos campos a ObjectId si tienes datos de referencia
            departamento: null,
            grupo: null,
            marca: null,
            impuesto: null
        }));


        // Cargar datos en MongoDB
        await Producto.insertMany(productosTransformados);

        res.status(200).json({ message: 'Datos cargados correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cargar los datos' });
    }
};

exports.getAllProductos = async (req, res) => {
    try {
        // Recuperar todos los productos de la base de datos
        const productos = await Producto.find({});
        res.status(200).json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al recuperar los productos' });
    }
};

exports.saveVenta = async (req, res) => {
    try {
        const { sucursal, productos, total, fecha } = req.body;

        if (!sucursal || !productos || !total || !fecha) {
            return res.status(400).json({ error: 'Faltan datos en la solicitud' });
        }

        const venta = new Venta({
            sucursal,
            productos,
            total,
            fecha,
        });

        await venta.save();
        res.status(201).json({ success: true, mensaje: 'Venta guardada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar la venta' });
    }
};

exports.actualizarProductosConProductKey = async (req, res) => {
    try {
        // Paso 2: Recuperar todos los productos de la colección 'productosCobro'
        const productos = await Producto.find({});

        // Crear una función que maneje la solicitud a Alegra y la actualización del producto
        const actualizarProducto = (producto) => {
            return new Promise((resolve, reject) => {
                const options = {
                    method: 'GET',
                    url: `https://api.alegra.com/api/v1/items?name=${encodeURIComponent(producto.nombre)}`,
                    headers: {
                        accept: 'application/json',
                        authorization: 'Basic ZmFjdHVyYWxpbXBpb3NAaG90bWFpbC5jb206YWI0MTQ2YzQyZjhkMzY3ZjA1MmQ='
                    }
                };

                // Realizar la solicitud a la API de Alegra
                request(options, async (error, response, body) => {
                    if (error) {
                        console.error(`Error al buscar el producto ${producto.nombre} en Alegra:`, error);
                        return reject(error);
                    }

                    const alegraResponse = JSON.parse(body);

                    if (alegraResponse.length > 0) {
                        // Actualizar el producto en MongoDB con el `productKey`
                        const productKey = alegraResponse[0].productKey; // Suponiendo que 'productKey' es correcto
                        producto.productKey = productKey;

                        await producto.save(); // Guardar los cambios en la base de datos
                        console.log(`Producto ${producto.nombre} actualizado con productKey ${productKey}`);
                        resolve();
                    } else {
                        console.log(`No se encontró el producto ${producto.nombre} en Alegra`);
                        resolve();
                    }
                });
            });
        };

        // Paso 4: Esperar a que todas las promesas de actualización se completen
        await Promise.all(productos.map(actualizarProducto));

        res.status(200).send("Productos actualizados exitosamente.");
    } catch (error) {
        console.error("Error al actualizar productos:", error);
        res.status(500).send("Error al actualizar productos.");
    }
};


exports.actualizarProductosConExcel = async (req, res) => {
    try {
        // Ruta del archivo Excel
        const filePath = path.join(__dirname, '../../archivos', '20243.csv');
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Archivo no encontrado' });
        }
        // Leer el archivo Excel
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0]; // Usar la primera hoja
        const worksheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Leer todas las filas
        
        // Crear un objeto para mapear nombres a productKeys
        const productMap = {};
        excelData.forEach(row => {
            const id = row[0];      // ID del producto (columna 0)
            const nombre = row[1];  // Nombre del producto (columna 1)
            if (id && nombre) {
                productMap[nombre.trim()] = id;
            }
        });

        // Recuperar todos los productos de la colección 'productosCobro'
        const productos = await Producto.find({});

        // Función para actualizar un producto si se encuentra en el Excel
        const actualizarProducto = async (producto) => {
            const productKey = productMap[producto.nombre.trim()];
            if (productKey) {
                producto.productKey = id;
                await producto.save(); // Guardar los cambios en la base de datos
                console.log(`Producto ${producto.nombre} actualizado con productKey ${producto.id}`);
            } else {
                console.log(`No se encontró el producto ${producto.nombre} en el Excel`);
            }
        };

        // Iterar sobre los productos y actualizar
        await Promise.all(productos.map(actualizarProducto));

        res.status(200).send("Productos actualizados exitosamente.");
    } catch (error) {
        console.error("Error al actualizar productos:", error);
        res.status(500).send("Error al actualizar productos.");
    }
};

