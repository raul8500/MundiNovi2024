const Producto = require('../../../schemas/productosSchema/productosSchema');
const Kardex = require('../../../schemas/kardexSchema/kardexSchema');

exports.getAllKardex = async (req, res) => {
    try {
        // Obtener la sucursal desde los parámetros
        const { sucursal } = req.params;

        // Recuperar todos los productos para la sucursal específica
        const productos = await Producto.find();

        console.log(productos.length);

        // Crear un array para almacenar los resultados
        let productosResultado = [];
        let totalGeneral = 0;

        // Crear un array de Promesas para procesar todos los productos en paralelo
        const promesas = productos.map(async (producto) => {
            // Buscar el último registro en Kardex para cada producto por referencia y sucursal
            const kardexRegistro = await Kardex.find({ 
                reference: producto.reference,
                sucursal: sucursal
            }).sort({ fecha: -1 }).limit(1);

            // Si no encontramos un registro en el Kardex, retornamos vacío
            if (kardexRegistro.length === 0) return null;

            const existencia = kardexRegistro[0].existencia || 0;

            // Obtener el costo directamente desde producto.datosFinancieros.costo
            const costo = producto.datosFinancieros && producto.datosFinancieros.costo ? producto.datosFinancieros.costo : 0;

            // Calcular el importe (costo * existencia)
            const importe = costo * existencia;

            // Añadir el producto al resultado
            productosResultado.push({
                cantidad: existencia,
                reference: producto.reference,
                nombre: producto.name,
                costo: costo,
                importe: importe
            });

            // Sumar al total general
            totalGeneral += importe;
        });

        // Esperar a que todas las promesas se resuelvan
        await Promise.all(promesas);

        // Incluir el costo total de todo
        res.status(200).json({
            productos: productosResultado,
            totalGeneral: totalGeneral
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los registros del Kardex' });
    }
};
