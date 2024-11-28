const Producto = require('../../schemas/productosSchema/productosSchema'); // Esquema de productos
const Stock = require('../../schemas/stocksSchema/stocksSchema'); // Esquema de stocks
const fs = require('fs');
const path = require('path');
const { parse } = require('json2csv'); // Biblioteca para convertir JSON a CSV
const csvParser = require('csv-parser'); // Biblioteca para leer CSV

// Generar un reporte de stocks por sucursal
exports.generarReporteStocks = async (req, res) => {
    try {
        const { sucursalId } = req.params; // ID de la sucursal proporcionado como parámetro
        if (!sucursalId) {
            return res.status(400).send('Debe proporcionar un ID de sucursal.');
        }

        // Obtener todos los productos con sus referencias
        const productos = await Producto.find({}, 'reference');
        if (!productos.length) {
            return res.status(404).send('No se encontraron productos.');
        }

        // Obtener el stock de la sucursal
        const stockSucursal = await Stock.findOne({ sucursalId });
        if (!stockSucursal) {
            return res.status(404).send('No se encontraron registros de stock para esta sucursal.');
        }

        // Crear un arreglo para el reporte
        const reporte = productos.map((producto) => {
            // Buscar el producto en el array de la sucursal
            const stockProducto = stockSucursal.productos.find((p) => p.reference === producto.reference);

            return {
                reference: producto.reference,
                stockMinimo: stockProducto ? stockProducto.stockMinimo : 0,
                stockMaximo: stockProducto ? stockProducto.stockMaximo : 0,
            };
        });

        // Convertir el reporte a formato CSV
        const fields = ['reference', 'stockMinimo', 'stockMaximo'];
        const csv = parse(reporte, { fields });

        // Guardar el archivo CSV en el servidor temporalmente
        const filePath = path.join(__dirname, '../../archivos/reporte_stocks.csv');
        fs.writeFileSync(filePath, csv);

        // Enviar el archivo al cliente
        res.download(filePath, 'reporte_stocks.csv', (err) => {
            if (err) {
                console.error('Error al enviar el archivo:', err);
                res.status(500).send('Error al generar el reporte.');
            }

            // Eliminar el archivo después de enviarlo
            //fs.unlinkSync(filePath);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Actualizar stocks por sucursal desde un archivo CSV
exports.actualizarStocks = async (req, res) => {
    try {
        const { sucursalId } = req.params; // ID de la sucursal
        if (!sucursalId) {
            return res.status(400).send('Debe proporcionar un ID de sucursal.');
        }

        if (!req.file) {
            return res.status(400).send('Debe proporcionar un archivo CSV.');
        }

        const filePath = req.file.path; // Ruta del archivo cargado
        const actualizaciones = [];

        // Leer y parsear el archivo CSV
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => {
                const { reference, stockMinimo, stockMaximo } = row;

                if (reference && stockMinimo && stockMaximo) {
                    actualizaciones.push({
                        reference: reference.trim(),
                        stockMinimo: parseInt(stockMinimo, 10),
                        stockMaximo: parseInt(stockMaximo, 10),
                    });
                }
            })
            .on('end', async () => {
                try {
                    // Verificar la existencia del documento de la sucursal
                    let stockSucursal = await Stock.findOne({ sucursalId });

                    if (!stockSucursal) {
                        // Si no existe, crear un nuevo documento
                        stockSucursal = new Stock({ sucursalId, productos: [] });
                    }

                    // Procesar las actualizaciones
                    for (const actualizacion of actualizaciones) {
                        const { reference, stockMinimo, stockMaximo } = actualizacion;

                        // Verificar que el producto exista
                        const producto = await Producto.findOne({ reference });
                        if (!producto) {
                            console.log(`Producto con referencia ${reference} no encontrado. Omitido.`);
                            continue; // Si no existe, omitir
                        }

                        // Buscar el producto en el array de la sucursal
                        const productoExistente = stockSucursal.productos.find(p => p.reference === reference);

                        if (productoExistente) {
                            // Actualizar el producto existente
                            productoExistente.stockMinimo = stockMinimo;
                            productoExistente.stockMaximo = stockMaximo;
                        } else {
                            // Agregar un nuevo producto al array
                            stockSucursal.productos.push({ reference, stockMinimo, stockMaximo });
                        }
                    }

                    // Guardar los cambios
                    await stockSucursal.save();

                    // Eliminar el archivo temporal después del procesamiento
                    fs.unlinkSync(filePath);

                    res.status(200).send('Stocks actualizados correctamente.');
                } catch (error) {
                    console.error('Error al procesar las actualizaciones:', error);
                    res.status(500).send('Error al actualizar los stocks.');
                }
            })
            .on('error', (error) => {
                console.error('Error al leer el archivo CSV:', error);
                res.status(500).send('Error al procesar el archivo CSV.');
            });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};