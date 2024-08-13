const bcryptjs = require('bcryptjs');
const ModelUser = require('../../schemas/usersSchema');
const jwt = require('jsonwebtoken');


exports.registerUser = async (req, res) => {
    try {
        const body = req.body
        const passHash = await bcryptjs.hash(req.body.password, 4)
        body.password = passHash
        const respuesta = await ModelUser.create(body)
        res.send(respuesta);
    } catch (error) {
        console.log(error);
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

        console.log({message: 'Inicio de sesión exitoso', token} )
        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


