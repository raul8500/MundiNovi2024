const Egreso = require('../../schemas/egesosSchema/egresosSchema');
const CorteFinal = require('../../schemas/cortes/cortesFinalesSchema');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');


async function checkCorteUsuarioIniciadoONoFinalizado(userId) {
    try {
        const corte = await CorteFinal.findOne({
            usuario: userId,
            folio: { $exists: true }, // Asegura que el folio exista (corte iniciado)
            fecha_final: { $exists: false } // Verifica que el corte no esté finalizado
        });

        if (corte) {
            return corte.folio; // Retorna el folio del corte abierto
        }

        return null; // No hay corte iniciado ni pendiente
    } catch (error) {
        console.error('Error al buscar corte:', error);
        throw new Error('Error interno del servidor');
    }
}

exports.crearEgreso = async (req, res) => {
    try {
        const { importe, observaciones, sucursal, usuario } = req.body;
        let archivoComprobatorio = null;

        // Validar que exista un corte padre abierto
        const folioPadre = await checkCorteUsuarioIniciadoONoFinalizado(usuario);

        if (!folioPadre) {
            if (req.file) {
                fs.unlinkSync(req.file.path); // Elimina el archivo si se subió
            }
            return res.status(400).send({ message: 'No se puede realizar un egreso sin un corte abierto.' });
        }

        if (!importe || importe <= 0) {
            if (req.file) {
                fs.unlinkSync(req.file.path); // Elimina el archivo si se subió
            }
            return res.status(400).send({ message: 'El importe es obligatorio y debe ser mayor a 0.' });
        }

        if (!sucursal) {
            if (req.file) {
                fs.unlinkSync(req.file.path); // Elimina el archivo si se subió
            }
            return res.status(400).send({ message: 'La sucursal es obligatoria.' });
        }

        // Procesar el archivo comprobatorio, si se subió
        if (req.file) {
            const ext = path.extname(req.file.originalname); // Obtener la extensión del archivo original
            const baseFilename = path.basename(req.file.filename, path.extname(req.file.filename)); // Remover extensión
            const newFilename = `${baseFilename}${ext}`;
            const newPath = path.join('uploads', newFilename);

            fs.renameSync(req.file.path, newPath); // Renombrar el archivo para incluir la extensión correcta
            archivoComprobatorio = newPath; // Guardar la ruta del archivo con la extensión
        }

        // Generar un folio único para el egreso
        const ultimoEgreso = await Egreso.findOne().sort({ folioEgreso: -1 }).select('folioEgreso');
        const nuevoFolio = ultimoEgreso ? ultimoEgreso.folioEgreso + 1 : 1;

        // Crear el egreso
        const nuevoEgreso = new Egreso({
            folioEgreso: nuevoFolio,
            importe,
            observaciones,
            archivoComprobatorio: archivoComprobatorio || null,
            sucursal,
            usuario,
            folioPadre
        });

        await nuevoEgreso.save();

        return res.status(201).send({
            message: 'Egreso creado exitosamente.',
            egreso: nuevoEgreso
        });
    } catch (error) {
        console.error('Error al crear el egreso:', error);

        // Eliminar el archivo si ocurrió un error
        if (req.file?.path) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).send({ message: 'Error interno del servidor.' });
    }
};

exports.getAllEgresos = async (req, res) => {
    try {
        const egresos = await Egreso.find()
            .populate('sucursal') // Popular sucursal con campos específicos
            .populate('usuario') // Popular usuario con campos específicos
            .sort({ fechaHora: -1 }); // Ordenar por fecha y hora descendente

        res.status(200).send(egresos);
    } catch (error) {
        console.error('Error al obtener los egresos:', error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
};

exports.getEgresoById = async (req, res) => {
    try {
        const { id } = req.params;

        const egreso = await Egreso.findById(id)
            .populate('sucursal') // Popular sucursal con campos específicos
            .populate('usuario'); // Popular usuario con campos específicos

        if (!egreso) {
            return res.status(404).send({ message: 'Egreso no encontrado.' });
        }

        res.status(200).send(egreso);
    } catch (error) {
        console.error('Error al obtener el egreso por ID:', error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
};

exports.deleteEgreso = async (req, res) => {
    try {
        const { id } = req.params;

        const egreso = await Egreso.findById(id);

        if (!egreso) {
            return res.status(404).send({ message: 'Egreso no encontrado.' });
        }

        // Si el egreso tiene un archivo comprobatorio, eliminarlo del servidor
        if (egreso.archivoComprobatorio) {
            const fs = require('fs');
            const path = require('path'); // Usar path para manejar rutas correctamente
            const filePath = path.resolve(__dirname, '../../', egreso.archivoComprobatorio);
            
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Egreso.findByIdAndDelete(id);

        res.status(200).send({ message: 'Egreso eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar el egreso:', error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
};

