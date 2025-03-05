const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const dbconnect = require('./database/mongoDB');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');
const Message = require('./schemas/mensajes/mensajesSchema');
const ModelUser = require('./schemas/usersSchema/usersSchema');
const ModelSucursal = require('./schemas/sucursalSchema/sucursalSchema');
const jwt = require('jsonwebtoken');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload')


// Conectar a la base de datos
dbconnect();
const app = express();

// Crear el servidor HTTP
let server = http.createServer(app);

// Integrar Socket.IO con el servidor HTTP
const io = socketIo(server);

app.use(fileUpload());
// Configurar los encabezados CORS para permitir solicitudes desde un origen específico
app.use(cors());

// Seteamos el motor de plantillas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Seteamos la carpeta public para archivos estáticos
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(expressLayouts);
app.set('layout', 'layout/base'); // Define el layout base

// Para procesar datos enviados desde forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Seteamos las variables de entorno
dotenv.config({ path: './env/.env' });

// Para poder trabajar con las cookies
app.use(cookieParser());

// Llamar al router
app.use('/', require('./routes/router'));

// Para eliminar la cache
app.use(function (req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

// Configurar Socket.IO
io.on('connection', (socket) => {
    // Cargar mensajes al conectarse
    Message.find()
        .populate('user', 'name sucursalId')
        .sort({ date: 1 })
        .then(async messages => {
            const messagesWithSucursal = await Promise.all(messages.map(async (message) => {
                const user = message.user;
                const sucursal = await ModelSucursal.findById(user.sucursalId).select('nombre');
                return {
                    ...message.toObject(),
                    user: {
                        ...user.toObject(),
                        sucursal: sucursal ? sucursal.nombre : 'Sucursal desconocida'
                    }
                };
            }));
            socket.emit('loadMessages', messagesWithSucursal);
        })
        .catch(error => console.error('Error al cargar los mensajes:', error));

    // Enviar un mensaje nuevo
    socket.on('sendMessage', async (data) => {
        try {
            const token = socket.handshake.headers.cookie.split('jwt=')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRETO);
            const user = await ModelUser.findById(decoded.id);
            const sucursal = await ModelSucursal.findById(user.sucursalId).select('nombre');

            const newMessage = new Message({
                user: user._id,
                date: new Date(),
                text: data.text
            });

            await newMessage.save();

            io.emit('newMessage', {
                user: {
                    name: user.name,
                    sucursal: sucursal ? sucursal.nombre : 'Sucursal desconocida'
                },
                date: newMessage.date,
                text: newMessage.text
            });
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
        }
    });
});

// Limpieza de mensajes antiguos
setInterval(() => {
    Message.deleteMany({ date: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } })
        .then(() => console.log('Mensajes antiguos eliminados'));
}, 24 * 60 * 60 * 1000); // Cada 24 horas

// Manejar errores globales en el servidor
server.on('error', (err) => {
    if (err.code === 'ECONNRESET') {
        console.warn('⚠️ Conexión reseteada por el cliente. Ignorando y continuando...');
    } else {
        console.error('🔥 Error en el servidor:', err);
    }
});

// Capturar errores en solicitudes individuales
app.use((err, req, res, next) => {
    if (err.code === 'ECONNRESET') {
        console.warn('⚠️ Error ECONNRESET en la solicitud.');
        res.status(500).send('Error interno del servidor. Intenta de nuevo.');
    } else {
        console.error('🔥 Error inesperado:', err);
        res.status(500).send('Error interno del servidor.');
    }
});

// Reiniciar conexiones fallidas automáticamente
function restartServer() {
    console.warn('🔄 Reiniciando servidor...');
    server.close(() => {
        server = http.createServer(app);
        server.listen(3000, () => console.log('✅ Servidor reiniciado correctamente'));
    });
}

// Capturar errores críticos
process.on('uncaughtException', (err) => {
    console.error('🚨 Excepción no controlada:', err);
    restartServer();
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 Promesa no manejada:', reason);
    restartServer();
});

// Iniciar el servidor
server.listen(3000, () => {
    console.log('🚀 Servidor corriendo en el puerto 3000');
});
