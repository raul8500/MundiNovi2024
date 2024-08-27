const request = require('request');

// Exporta la función para obtener contactos de Alegra
exports.getContacts = (req, res) => {
  const options = {
    method: 'GET',
    url: 'https://api.alegra.com/api/v1/contacts?order_direction=ASC',
    headers: {
      accept: 'application/json',
      authorization: 'Basic ZmFjdHVyYWxpbXBpb3NAaG90bWFpbC5jb206YWI0MTQ2YzQyZjhkMzY3ZjA1MmQ='
    }
  };

  request(options, (error, response, body) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al obtener contactos', error });
    }

    try {
      const data = JSON.parse(body);
      return res.status(200).json(data);
    } catch (parseError) {
      console.error(parseError);
      return res.status(500).json({ message: 'Error al procesar la respuesta', error: parseError });
    }
  });
};
