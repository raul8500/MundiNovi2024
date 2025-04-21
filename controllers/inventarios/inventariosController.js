const Inventario = require('../../schemas/inventariosSchema/inventariosSchema');
const Kardex = require('../../schemas/kardexSchema/kardexSchema');
const Product = require('../../schemas/productosSchema/productosSchema');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const ExcelJS = require('exceljs');


const getNextFolio = async () => {
    const lastInventario = await Inventario.findOne().sort({ folio: -1 }).select('folio');
    return lastInventario ? lastInventario.folio + 1 : 1; // Si no hay registros, comienza en 1
};

exports.crearOActualizarInventario = async (req, res) => {
    try {
      const { sucursal, productos, encargado, tipo } = req.body;
  
      if (!sucursal || !encargado || !tipo || !Array.isArray(productos) || productos.length === 0) {
        return res.status(400).send({ message: 'Sucursal, encargado, tipo y productos son requeridos.' });
      }
  
      const sucursalId = mongoose.isValidObjectId(sucursal)
        ? new mongoose.Types.ObjectId(sucursal)
        : sucursal;
  
      let inventario = await Inventario.findOne({ sucursal: sucursalId, estado: false });
  
      if (inventario && inventario.encargado.toString() !== encargado) {
        inventario = null; // Forzar la creación de uno nuevo si el encargado cambió
      }
  
      const todosLosProductos = await Product.find({ esActivo: true });
      if (!todosLosProductos.length) {
        return res.status(404).send({ message: 'No hay productos activos para generar el inventario.' });
      }
  
      const mapaCostos = todosLosProductos.reduce((map, producto) => {
        map[producto.reference] = producto.datosFinancieros?.costo || 0;
        return map;
      }, {});
  
      const movimientosKardex = await Kardex.aggregate([
        { $match: { sucursal: sucursalId } },
        { $sort: { reference: 1, fecha: -1 } },
        {
          $group: {
            _id: '$reference',
            descripcion: { $first: '$nombre' },
            ultimaExistencia: { $first: '$existencia' }
          }
        }
      ]);
  
      const mapaExistencias = movimientosKardex.reduce((map, item) => {
        map[item._id] = item.ultimaExistencia || 0;
        return map;
      }, {});
  
      // Generar mapa para existencia física de los productos recibidos
      const mapaFisica = productos.reduce((map, prod) => {
        map[prod.referencia] = prod.existenciaFisica;
        return map;
      }, {});
  
      const productosFinales = todosLosProductos.map(producto => {
        const referencia = producto.reference;
        const existenciaFisica = mapaFisica[referencia] || 0;
        const existenciaContable = mapaExistencias[referencia] || 0;
        const costo = mapaCostos[referencia] || 0;
  
        let diferencia = existenciaContable < 0
          ? existenciaFisica + existenciaContable
          : existenciaFisica - existenciaContable;
  
        const importe = diferencia * costo;
  
        return {
          referencia,
          descripcion: producto.name || producto.description,
          existenciaFisica,
          existenciaContable,
          diferencia,
          costo,
          importe
        };
      });
  
      const productosConMovimiento = productosFinales.filter(p => p.diferencia !== 0);
  
      if (inventario) {
        inventario.productos = productosFinales;
        inventario.productosConMovimiento = productosConMovimiento;
        inventario.tipo = tipo;
        await inventario.save();
  
        return res.status(200).send({
          message: 'Inventario actualizado exitosamente.',
          inventario
        });
      } else {
        const folio = await getNextFolio();
  
        inventario = new Inventario({
          folio,
          sucursal: sucursalId,
          encargado: new mongoose.Types.ObjectId(encargado),
          estado: false,
          tipo,
          productos: productosFinales,
          productosConMovimiento
        });
  
        await inventario.save();
  
        return res.status(201).send({
          message: 'Inventario creado exitosamente.',
          inventario
        });
      }
    } catch (error) {
      console.error('Error al crear o actualizar el inventario:', error);
      res.status(500).send({ message: 'Error interno del servidor.' });
    }
  };
  

exports.getAllInventarios = async (req, res) => {
    try {
        // Recuperar todos los inventarios
        const inventarios = await Inventario.find()
            .populate('sucursal') // Expandir la sucursal y mostrar solo campos relevantes
            .populate('encargado'); // Expandir el encargado y mostrar solo campos relevantes

        res.status(200).send(inventarios);
    } catch (error) {
        console.error('Error al obtener los inventarios:', error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
};

exports.getInventarioById = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar el inventario por ID
        const inventario = await Inventario.findById(id)
            .populate('sucursal', 'nombre direccion') // Expandir sucursal
            .populate('encargado', 'nombre email'); // Expandir encargado

        if (!inventario) {
            return res.status(404).send({ message: 'Inventario no encontrado.' });
        }

        res.status(200).send(inventario);
    } catch (error) {
        console.error('Error al obtener el inventario por ID:', error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
};

exports.deleteInventario = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar y eliminar el inventario por ID
        const inventarioEliminado = await Inventario.findByIdAndDelete(id);

        if (!inventarioEliminado) {
            return res.status(404).send({ message: 'Inventario no encontrado.' });
        }

        res.status(200).send({ message: 'Inventario eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar el inventario:', error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
};

exports.cambiarEstadoInventario = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (typeof estado !== 'boolean') {
            return res.status(400).send({ message: 'El estado debe ser un valor booleano.' });
        }

        // Buscar y actualizar el estado del inventario
        const inventarioActualizado = await Inventario.findByIdAndUpdate(
            id,
            { estado },
            { new: true } // Devuelve el documento actualizado
        );

        if (!inventarioActualizado) {
            return res.status(404).send({ message: 'Inventario no encontrado.' });
        }

        res.status(200).send({
            message: 'Estado del inventario actualizado exitosamente.',
            inventario: inventarioActualizado
        });
    } catch (error) {
        console.error('Error al cambiar el estado del inventario:', error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
};

exports.descargarInventario = async (req, res) => {
    try {
      const { id } = req.params;
  
      const inventario = await Inventario.findById(id)
        .populate('sucursal')
        .populate('encargado');
  
      if (!inventario) {
        return res.status(404).send({ message: 'Inventario no encontrado.' });
      }
  
      // Crear un nuevo workbook y hoja
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Inventario Movimiento');
  
      // Agregar encabezados del inventario
      worksheet.addRow(['Sucursal:', inventario.sucursal?.nombre || 'N/A']);
      worksheet.addRow(['Encargado:', inventario.encargado?.name || 'N/A']);
      worksheet.addRow(['Fecha de Finalización:', inventario.updatedAt.toLocaleString()]);
      worksheet.addRow([]);
      worksheet.addRow([
        'Referencia',
        'Descripción',
        'Existencia Física',
        'Existencia Contable',
        'Diferencia',
        'Costo',
        'Importe',
      ]);
  
      // Agregar los productos con movimiento
      inventario.productosConMovimiento.forEach((producto) => {
        const contable = producto.existenciaContable || 0;
        const fisica = producto.existenciaFisica || 0;
        const costo = producto.costo || 0;
  
        // Calcular diferencia con la nueva lógica
        const diferencia = contable < 0
          ? fisica + contable
          : fisica - contable;
  
        const importe = diferencia * costo;
  
        worksheet.addRow([
          producto.referencia,
          producto.descripcion,
          fisica,
          contable,
          diferencia,
          costo,
          importe,
        ]);
      });
  
      // Estilo para la hoja
      worksheet.columns.forEach((column) => {
        column.width = 20;
      });
      worksheet.getRow(1).font = { bold: true };
  
      // Enviar el archivo al cliente
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=Inventario_${inventario.folio}.xlsx`);
  
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error al generar el Excel:', error);
      res.status(500).send({ message: 'Error interno del servidor.' });
    }
  };
  


