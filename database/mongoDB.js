const mongoose = require('mongoose'); // Corregido el nombre del módulo

const dbconnect = () => {
    mongoose.connect('mongodb://mongo:LdcINAnjIrPpdKbprhRbPGEYbRkaXuhg@monorail.proxy.rlwy.net:57404', {
    })
    .then(() => {
        console.log('Conexión correcta');
    })
    .catch(err => {
        console.error('Error al conectarse a la BD', err);
    });
};

module.exports = dbconnect;
