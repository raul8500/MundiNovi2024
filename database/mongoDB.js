const mongoose = require('mongoose'); // Corregido el nombre del módulo

const dbconnect = () => {
    mongoose.connect('mongodb://mongo:qahOeWeMgGRYeYAjpAYOrQXDQseDHhbj@junction.proxy.rlwy.net:36379', {
    })
    .then(() => {mongodb://mongo:qahOeWeMgGRYeYAjpAYOrQXDQseDHhbj@junction.proxy.rlwy.net:36379
        console.log('Conexión correcta');
    })
    .catch(err => {
        console.error('Error al conectarse a la BD', err);
    });
};

module.exports = dbconnect;
