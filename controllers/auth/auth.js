const bcryptjs = require('bcryptjs');
const ModelUser = require('../../schemas/usersSchema/usersSchema');
const jwt = require('jsonwebtoken');


exports.registerUser = async (req, res) => {
    try {
        const { name, username, email, rol, password, img, sucursalId } = req.body;

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
        const userData = await ModelUser.findOne({ username: username });

        // Verificar si se encontró un usuario
        if (!userData) {
            return res.status(401).json({ error: 'Nombre de usuario o contraseña incorrectos' });
        }

        const hashedPassword = userData.password;

        // Comparar la contraseña ingresada con la contraseña almacenada en la base de datos
        const passwordMatch = await bcryptjs.compare(password, hashedPassword);

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

        console.log({message: 'Inicio de sesión exitoso', token , name: userData.name, user: userData.username, date: Date() } )
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


