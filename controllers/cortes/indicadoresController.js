const Indicadores = require('../../schemas/cortes/indicadoresSchema')
const Sucursal = require('../../schemas/sucursalSchema/sucursalSchema'); // Asegúrate de poner la ruta correcta a tu modelo



// Obtener todos los indicadores de ventas
exports.getIndicadores = async (req, res) => {
    try {
        // Paso 1: Obtener todas las sucursales
        const sucursales = await Sucursal.find();

        // Paso 2: Obtener los indicadores de ventas ya registrados
        const indicadores = await Indicadores.find().populate('sucursalId', 'nombre');

        // Paso 3: Mapear las sucursales y asignarles los indicadores si ya existen o ponerles 0
        const resultado = sucursales.map(sucursal => {
            // Buscar el indicador asociado a la sucursal por sucursalId
            const indicador = indicadores.find(i => i.sucursalId._id.toString() === sucursal._id.toString());

            // Si no existe el indicador, asignar valores 0
            if (!indicador) {
                return {
                    sucursalId: sucursal._id,
                    nombre: sucursal.nombre,
                    verde: 0,
                    naranja: 0,
                    rojo: 0
                };
            } else {
                // Si existe el indicador, devolver el indicador correspondiente
                return {
                    sucursalId: indicador.sucursalId,
                    nombre: sucursal.nombre,
                    verde: indicador.verde,
                    naranja: indicador.naranja,
                    rojo: indicador.rojo,
                    fecha: indicador.fecha
                };
            }
        });

        // Devolver la lista de sucursales con sus indicadores correspondientes
        res.status(200).json(resultado);
    } catch (error) {
        console.error('Error al obtener los indicadores de ventas:', error);
        res.status(500).send('Error interno del servidor');
    }
};




// Obtener indicador de ventas por ID
exports.getIndicadorById = async (req, res) => {
    try {
        const { id } = req.params;
        const indicador = await Indicadores.findById(id).populate('sucursalId', 'nombre'); // Si quieres obtener el nombre y ubicación de la sucursal

        if (!indicador) {
            return res.status(404).send('Indicador no encontrado');
        }

        res.status(200).json(indicador);
    } catch (error) {
        console.error('Error al obtener el indicador por ID:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// Crear un nuevo indicador de ventas
exports.createIndicador = async (req, res) => {
    try {
        const { sucursalId, indicadorVentas } = req.body;

        // Crear un nuevo registro de indicador
        const newIndicador = new Indicadores({
            sucursalId,
            indicadorVentas
        });

        await newIndicador.save();
        res.status(201).json(newIndicador); // Devolver el nuevo indicador creado
    } catch (error) {
        console.error('Error al crear un nuevo indicador:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// Actualizar indicador de ventas por ID
exports.updateIndicador = async (req, res) => {
    try {
        const { id } = req.params;
        const { indicadorVentas } = req.body;

        // Actualizar el indicador de ventas
        const indicador = await Indicadores.findByIdAndUpdate(id, { indicadorVentas }, { new: true });

        if (!indicador) {
            return res.status(404).send('Indicador no encontrado');
        }

        res.status(200).json(indicador);
    } catch (error) {
        console.error('Error al actualizar el indicador de ventas:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// Eliminar indicador de ventas por ID
exports.deleteIndicador = async (req, res) => {
    try {
        const { id } = req.params;

        // Eliminar el indicador de ventas
        const indicador = await Indicadores.findByIdAndDelete(id);

        if (!indicador) {
            return res.status(404).send('Indicador no encontrado');
        }

        res.status(200).send('Indicador eliminado con éxito');
    } catch (error) {
        console.error('Error al eliminar el indicador de ventas:', error);
        res.status(500).send('Error interno del servidor');
    }
};


// Actualizar o crear el indicador de ventas para una sucursal
exports.updateOrCreateIndicador = async (req, res) => {
    try {
        const { sucursalId, verde, naranja, rojo } = req.body;

        // Paso 1: Buscar o crear un nuevo indicador de ventas
        const indicador = await Indicadores.findOneAndUpdate(
            { sucursalId },  // Buscar por el ID de la sucursal
            { verde, naranja, rojo },  // Los nuevos valores para los indicadores
            { new: true, upsert: true } // Si no se encuentra el documento, lo crea
        );

        // Devolver el indicador actualizado o creado
        res.status(200).json(indicador);
    } catch (error) {
        console.error('Error al actualizar o crear el indicador de ventas:', error);
        res.status(500).send('Error interno del servidor');
    }
};
