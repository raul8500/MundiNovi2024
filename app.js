const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const dbconnect = require('./database/mongoDB')
const cookieParser = require('cookie-parser');

dbconnect();
const app = express();

// Configurar los encabezados CORS para permitir solicitudes desde un origen específico (en este caso, http://172.16.1.68)
app.use(cors());
// Seteamos el motor de plantillas
app.set('view engine', 'ejs');

// Seteamos la carpeta public para archivos estáticos
app.use(express.static('public'));

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

app.listen(3000, () => {
    console.log('SERVER UP running in https://localhost:3000');
});
