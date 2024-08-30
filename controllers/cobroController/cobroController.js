const Producto = require('../../schemas/cobrosSchema/cobroSchema'); // Ajusta la ruta según sea necesario
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const Venta = require('../../schemas/venta/ventaSchema');

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

