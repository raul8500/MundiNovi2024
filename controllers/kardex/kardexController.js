const Kardex = require('../../schemas/kardexSchema/kardexSchema');
const Sucursal = require('../../schemas/sucursalSchema/sucursalSchema');
const Producto = require('../../schemas/productosSchema/productosSchema');
const { v4: uuidv4 } = require('uuid'); // Utiliza UUID para generar un folio único


exports.createKardex = async (req, res) => {
    try {
        const { usuario, movimiento, sucursal, sucursalDestino, reference, nombre, cantidad } = req.body;

        // Función para generar un folio de 7 dígitos
        const generateFolio = () => {
            return String(Math.floor(1000000 + Math.random() * 9000000)); // Genera un número aleatorio de 7 dígitos
        };

        // Generar un folio único si no se proporciona uno
        let folio = req.body.folio || generateFolio();

        // Verificar que el folio no exista ya en la base de datos
        const folioExistente = await Kardex.findOne({ folio });
        if (folioExistente) {
            return res.status(400).json({ error: 'El folio ya existe. Por favor, genere uno nuevo.' });
        }

        // Buscar el producto para obtener el costo unitario
        const producto = await Producto.findOne({ reference });
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const costoUnitario = producto.datosFinancieros.costo;

        // Procesar la cantidad para determinar si es positiva o negativa
        let cantidadNumerica = parseInt(cantidad, 10);
        if (isNaN(cantidadNumerica)) {
            return res.status(400).json({ error: 'Cantidad inválida' });
        }

        // Buscar el último registro del Kardex para el producto especificado
        const ultimoKardex = await Kardex.findOne({ reference }).sort({ fecha: -1 });

        // Calcular la nueva existencia
        let nuevaExistencia;
        if (ultimoKardex) {
            nuevaExistencia = ultimoKardex.existencia + cantidadNumerica;
        } else {
            nuevaExistencia = cantidadNumerica;
        }

        // Obtener la fecha actual del sistema
        const fechaActual = new Date();

        // Crear un nuevo registro en Kardex
        const nuevoKardex = new Kardex({
            fecha: fechaActual,
            folio,
            usuario,
            movimiento,
            sucursal,
            sucursalDestino: sucursalDestino || null,
            reference,
            nombre,
            cantidad,
            existencia: nuevaExistencia,
            costoUnitario
        });

        // Guardar el nuevo registro en Kardex
        const kardexGuardado = await nuevoKardex.save();

        // Actualizar la existencia del producto en la colección de Productos
        await Producto.updateOne(
            { reference },
            { $set: { controlAlmacen: nuevaExistencia } }
        );

        res.status(201).json({ message: 'Registro de Kardex creado correctamente', data: kardexGuardado });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el registro en el Kardex' });
    }
};

exports.getAllKardex = async (req, res) => {
    try {
        const { sucursal, fechaInicio, fechaFinal } = req.query;
        const reference = req.query.reference ? req.query.reference.trim() : '';

        // Validar parámetros de fecha
        if (!fechaInicio || !fechaFinal) {
            return res.status(400).json({ error: 'Fecha de inicio y fecha final son requeridas' });
        }

        // Crear objetos Date a partir de las fechas de inicio y fin
        const fechaInicioDate = new Date(fechaInicio);
        let fechaFinalDate = new Date(fechaFinal);
        fechaFinalDate.setDate(fechaFinalDate.getDate() + 1);


        // Verificar que las fechas sean válidas
        if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinalDate.getTime())) {
            return res.status(400).json({ error: 'Fecha de inicio o fecha final inválida' });
        }

        // Asegurarse de que la fecha final sea al final del último día
        fechaFinalDate = new Date(fechaFinal); // Reasignar para asegurarnos de aplicar el ajuste
        fechaFinalDate.setHours(17, 59, 59, 999);
        fechaFinalDate.setDate(fechaFinalDate.getDate() + 1);
        // Crear la consulta base
        const query = {
            fecha: { 
                $gte: fechaInicioDate.toISOString(), 
                $lte: fechaFinalDate.toISOString() 
            },
            ...(sucursal && { sucursal }) // Filtrar por sucursal si se proporciona
        };

        // Agregar filtro por referencia si se proporciona
        if (reference) {
            query.reference = reference;
        }

        console.log('Query:', query);

        // Buscar los registros en la colección Kardex e incluir datos de usuario y sucursal
        const kardexRegistros = await Kardex.find(query)
            .populate('sucursal', 'nombre') // Obtener el campo 'nombre' de la sucursal
            .populate('usuario', 'username') // Obtener el campo 'username' del usuario
            .sort({ fecha: -1 });

        res.status(200).json({ data: kardexRegistros });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los registros del Kardex' });
    }
};




