const mongoose = require('mongoose');

const dbconnect = async () => {
    try {
        await mongoose.connect('mongodb://mongo:dFzoeShHsdmAVtUBKJRbUyHIDqnFjwmk@autorack.proxy.rlwy.net:56976', {
            
        });
        console.log('Conexión correcta');

    } catch (err) {
        console.error('Error al conectarse a la BD', err);
    }
};

module.exports = dbconnect;
