const Producto = require('../../schemas/cobrosSchema/cobroSchema'); // Ajusta la ruta según sea necesario
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const Venta = require('../../schemas/venta/ventaSchema');

exports.loadProductosFromFile = async (req, res) => {
    try {
        // Ruta del archivo específico
        const filePath = path.join(__dirname, '../../archivos', '2024.xlsx');
        
        // Verificar si el archivo existe
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Archivo no encontrado' });
        }

        // Leer el archivo Excel
        const workbook = XLSX.readFile(filePath);
        console.log(workbook)
        const sheet_name_list = workbook.SheetNames;
        const productosData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {
            header: ['clave', 'nombre', 'precio1', 'precio2', 'precio3', 'precio4', 'precio5', 'precio6', 'precio7', 'precio8', 'precio9', 'precio10']
        });

        // Cargar datos en MongoDB
        await Producto.insertMany(productosData);

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

