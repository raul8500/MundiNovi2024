const bcryptjs = require('bcryptjs');
const ModelUser = require('../../schemas/usersSchema/usersSchema');
const Sucursal = require('../../schemas/sucursalSchema/sucursalSchema');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


exports.registerUser = async (req, res) => {
    try {
        const { name, username, email, rol, password, img, sucursalId } = req.body;
        let status = 1;

        // Verificar si ya existe un usuario con el mismo nombre
        const existingUser = await ModelUser.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });
        }

        // Encriptar la contraseña
        const passHash = await bcryptjs.hash(password, 4);

        // Crear el nuevo usuario
        const newUser = await ModelUser.create({
            name,
            username,
            email,
            rol,
            password: passHash,
            img,
            status,
            sucursalId
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Buscar el usuario por su nombre de usuario en la base de datos
        const userData = await ModelUser.findOne({ username });

        // Verificar si se encontró un usuario
        if (!userData) {
            return res.status(401).json({ error: 'Nombre de usuario o contraseña incorrectos' });
        }

        // Verificar si el usuario está activo o tiene un rango importante
        if (userData.status === 2) {
            return res.status(403).json({ error: 'Tu cuenta está inactiva. Contacta al administrador.' });
        }

        const passwordMatch = await bcryptjs.compare(password, userData.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Nombre de usuario o contraseña incorrectos' });
        }

        // Crear un token JWT para el usuario
        const token = jwt.sign({ id: userData._id }, process.env.JWT_SECRETO, {
            expiresIn: process.env.JWT_TIEMPO_EXPIRA
        });

        // Establecer la cookie con el token JWT
        const expiresInDays = parseInt(process.env.JWT_COOKIE_EXPIRES, 10);
        const expiresDate = new Date();
        expiresDate.setDate(expiresDate.getDate() + expiresInDays);

        const cookiesOptions = {
            expires: expiresDate,
            httpOnly: true
        };

        res.cookie('jwt', token, cookiesOptions);

        console.log({
            message: 'Inicio de sesión exitoso',
            token,
            name: userData.name,
            user: userData.username,
            date: Date()
        });

        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const users = await ModelUser.find().populate('sucursalId'); // Asegúrate de ajustar 'sucursalId' si es una referencia en tu modelo
        res.send(users);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Obtener un usuario por _id
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await ModelUser.findById(id).populate('sucursalId'); // Asegúrate de ajustar 'sucursalId' si es una referencia en tu modelo

        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        res.send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Actualizar un usuario por _id
exports.updateUserById = async (req, res) => {
    try {
        console.log(req.body)
        const { id } = req.params; // Extraer el ID directamente
        const { name, username, rol, img, sucursalId } = req.body;

        // Verificar si el nombre de usuario ya está en uso por otro usuario
        const existingUser = await ModelUser.findOne({ username });

        // Verificar si el usuario existe y si no es el mismo que se está actualizando
        if (existingUser && existingUser._id.toString() !== id) {
            return res.status(409).json({ message: 'El nombre de usuario ya está en uso.' });
        }

        // Actualizar el usuario
        const updatedUser = await ModelUser.findByIdAndUpdate(id, {
            name,
            username,
            rol,
            img,
            sucursalId
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).send('Usuario no encontrado');
        }

        res.send(updatedUser);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Función para actualizar la contraseña del usuario
exports.updatePassword = async (req, res) => {
    try {
        const { newPassword } = req.body; // Obtener solo newPassword desde el cuerpo de la solicitud
        const { id } = req.params; // Obtener el ID del usuario desde los parámetros de la URL

        const hashedPassword = await bcryptjs.hash(newPassword, 10); // Hashear la nueva contraseña

        // Actualizar la contraseña del usuario
        const user = await ModelUser.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });

        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        res.send('Contraseña actualizada correctamente');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};


// Función para eliminar un usuario por _id
exports.deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await ModelUser.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        res.send('Usuario eliminado correctamente');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};


exports.updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body; // Obtener el estado (1 o 2) desde el cuerpo de la solicitud
        const { id } = req.params; // Obtener el ID del usuario desde los parámetros de la URL

        // Actualizar el estado del usuario
        const user = await ModelUser.findByIdAndUpdate(id, { status: status }, { new: true });

        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        res.send('Estado del usuario actualizado correctamente');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno del servidor');
    }
};

exports.obtenerSucursalesYUsuarios = async (req, res) => {
    try {
        // Extraer y limpiar los IDs de las sucursales desde los parámetros o el cuerpo
        let { sucursalId1, sucursalId2 } = req.params; // O req.body si los pasas en el cuerpo

        if (!sucursalId1 || !sucursalId2) {
            return res.status(400).json({
                success: false,
                message: 'Se requieren dos IDs de sucursales.'
            });
        }

        // Eliminar saltos de línea y espacios en blanco
        sucursalId1 = sucursalId1.trim().replace(/\n/g, '');
        sucursalId2 = sucursalId2.trim().replace(/\n/g, '');

        // Validar que los IDs sean ObjectId válidos
        const mongoose = require('mongoose');
        if (!mongoose.Types.ObjectId.isValid(sucursalId1) || !mongoose.Types.ObjectId.isValid(sucursalId2)) {
            return res.status(400).json({
                success: false,
                message: 'Uno o ambos IDs no son válidos.'
            });
        }

        // Buscar las sucursales por sus IDs
        const sucursales = await Sucursal.find({
            _id: { $in: [sucursalId1, sucursalId2] }
        });

        if (sucursales.length !== 2) {
            return res.status(404).json({
                success: false,
                message: 'Una o ambas sucursales no fueron encontradas.'
            });
        }

        // Buscar los usuarios asociados a las sucursales
        const usuarios = await ModelUser.find({
            sucursalId: { $in: [sucursalId1, sucursalId2] }
        });

        // Formatear la respuesta
        const respuesta = sucursales.map(sucursal => ({
            sucursal,
            usuarios: usuarios.filter(user => user.sucursalId.equals(sucursal._id))
        }));

        return res.status(200).json({
            success: true,
            data: respuesta
        });

    } catch (error) {
        console.error('Error al obtener sucursales y usuarios:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor.',
            error: error.message
        });
    }
};

exports.obtenerUsuariosPorSucursal = async (req, res) => {
    try {
        const { sucursalId } = req.params; // Obtener el ID de la sucursal desde la URL

        // Validar que el ID es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(sucursalId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID de la sucursal no es válido.'
            });
        }

        // Buscar la sucursal por su ID
        const sucursal = await Sucursal.findById(sucursalId);
        if (!sucursal) {
            return res.status(404).json({
                success: false,
                message: 'Sucursal no encontrada.'
            });
        }

        // Buscar los usuarios asociados a la sucursal
        const usuarios = await ModelUser.find({ sucursalId: sucursalId });

        return res.status(200).json({
            success: true,
            sucursal,
            usuarios
        });

    } catch (error) {
        console.error('Error al obtener usuarios por sucursal:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor.',
            error: error.message
        });
    }
};
