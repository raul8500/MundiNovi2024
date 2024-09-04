const request = require('request');

exports.obtenerToken = (req, res) => {
    const options = {
        method: 'POST',
        url: 'https://authcli.stagefacturador.com/connect/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            grant_type: 'password',
            scope: 'offline_access openid APINegocios',
            username: 'GOYA780416GM0',
            password: '20b03da6247eb1ba4a04c3bda7285c94',
            client_id: 'webconector1',
            client_secret: 'D2EBED43-3DAD-48E8-906A-1B2221C63062',
            es_md5: 'true'
        }
    };

    request(options, (error, response, body) => {
        if (error) {
            return res.status(500).json({ error: 'Error al realizar la solicitud' });
        }

        if (response.statusCode !== 200) {
            return res.status(response.statusCode).json({ error: body });
        }

        res.status(200).json(JSON.parse(body));
    });
};


exports.actualizarToken = (req, res) => {
    const { refreshToken } = req.body; // Extraer el refresh token del cuerpo de la solicitud

    const options = {
        method: 'POST',
        url: 'https://authcli.stagefacturador.com/connect/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: 'CLIENTE_ID',  // Reemplazar con tu client_id
            client_secret: 'CLIENTE_SECRET'  // Reemplazar con tu client_secret
        }
    };

    request(options, (error, response, body) => {
        if (error) {
            return res.status(500).json({ error: 'Error al realizar la solicitud' });
        }

        if (response.statusCode !== 200) {
            return res.status(response.statusCode).json({ error: body });
        }

        res.status(200).json(JSON.parse(body));
    });
};