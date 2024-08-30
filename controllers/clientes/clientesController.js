const request = require('request');
const Client = require('../../schemas/clientesSchema/complementosSchema/clientesAlegraSchema'); // Asegúrate de ajustar la ruta al modelo Client según tu estructura
const rp = require('request-promise');



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

exports.getContactsAndSave = async (req, res) => {
  const allContacts = [];
  const batchSize = 30;
  let start = 1;
  let iteration = 1;

  while (true) {
    console.log(`Iteración ${iteration}: Recuperando contactos desde ${start}`);

    const options = {
      method: 'GET',
      url: `https://api.alegra.com/api/v1/contacts?start=${start}&limit=${batchSize}&order_direction=ASC`,
      headers: {
        accept: 'application/json',
        authorization: 'Basic ZmFjdHVyYWxpbXBpb3NAaG90bWFpbC5jb206YWI0MTQ2YzQyZjhkMzY3ZjA1MmQ='
      }
    };

    try {
      const response = await new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
          if (error) return reject(error);
          resolve({ response, body });
        });
      });

      const data = JSON.parse(response.body);

      // Verifica la estructura de los datos
      if (!Array.isArray(data)) {
        console.error('La respuesta de la API no es un array', data);
        return res.status(500).json({ message: 'La respuesta de la API no es un array' });
      }

      if (data.length === 0) {
        // No hay más datos que recuperar
        console.log('No hay más contactos que recuperar.');
        break;
      }

      // Agrega los datos al array total
      allContacts.push(...data);

      // Imprime información sobre la cantidad de contactos recuperados
      console.log(`Recuperados ${data.length} contactos desde ${start}`);

      // Actualiza el inicio para la siguiente página
      start += batchSize;
      iteration++;
    } catch (error) {
      console.error('Error al obtener contactos', error);
      return res.status(500).json({ message: 'Error al obtener contactos', error });
    }
  }

  // Guardar todos los contactos en la base de datos
  try {
    console.log('Guardando contactos en la base de datos...');
    let savedCount = 0;

    for (const contact of allContacts) {
      const newClient = new Client({
        id: contact.id,
        name: contact.name,
        identification: contact.identification,
        email: contact.email,
        phonePrimary: contact.phonePrimary,
        phoneSecondary: contact.phoneSecondary,
        fax: contact.fax,
        mobile: contact.mobile,
        observations: contact.observations,
        status: contact.status,
        cfdiUse: contact.cfdiUse,
        paymentType: contact.paymentType,
        paymentMethod: contact.paymentMethod,
        operationType: contact.operationType,
        thirdType: contact.thirdType,
        fiscalId: contact.fiscalId,
        regime: contact.regime,
        regimeObject: contact.regimeObject,
        address: contact.address,
        type: contact.type,
        seller: contact.seller,
        term: contact.term,
        priceList: contact.priceList,
        internalContacts: contact.internalContacts,
        statementAttached: contact.statementAttached,
        accounting: contact.accounting
      });

      await newClient.save();
      savedCount++;
      
      // Imprime información sobre los contactos guardados
      console.log(`Contacto guardado: ${savedCount}/${allContacts.length}`);
    }

    console.log('Todos los contactos han sido guardados exitosamente.');
    return res.status(200).json({ message: 'Contactos guardados exitosamente' });
  } catch (saveError) {
    console.error('Error al guardar los contactos', saveError);
    return res.status(500).json({ message: 'Error al guardar los contactos', error: saveError });
  }
};

exports.getAllContactsBD = async (req, res) => {
  try {
    const contacts = await Client.find(); // Obtiene todos los contactos
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error al obtener contactos', error);
    res.status(500).json({ message: 'Error al obtener contactos', error });
  }
};

exports.deleteContactById = async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica si el contacto con el _id existe
    const contact = await Client.findById(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }

    // Elimina el contacto
    await Client.findByIdAndDelete(id);

    res.status(200).json({ message: 'Contacto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar contacto', error);
    res.status(500).json({ message: 'Error al eliminar contacto', error });
  }
};

exports.deleteContactByUserId = (req, res) => {
  const { id } = req.params;

  // Configuración para la llamada a la API de Alegra
  const aletraApiUrl = `https://api.alegra.com/api/v1/contacts/${id}`;
  const aletraApiToken = 'ZmFjdHVyYWxpbXBpb3NAaG90bWFpbC5jb206YWI0MTQ2YzQyZjhkMzY3ZjA1MmQ='; // Reemplaza esto con tu token real

  // Realiza la solicitud DELETE a Alegra
  request.delete({
    url: aletraApiUrl,
    headers: {
      Authorization: `Basic ${aletraApiToken}`,
    },
  }, async (error, response, body) => {
    if (error) {
      console.error('Error al eliminar contacto de Alegra', error);
      return res.status(500).json({ message: 'Error al eliminar contacto en Alegra', error });
    }

    if (response.statusCode === 200) {
      try {
        // Verifica si el contacto existe en tu base de datos
        const contact = await Client.findOne({ id: id });
        if (!contact) {
          return res.status(404).json({ message: 'Contacto no encontrado en la base de datos' });
        }

        // Elimina el contacto de la base de datos
        await Client.deleteOne({ id: id });

        res.status(200).json({ message: 'Contacto eliminado exitosamente de Alegra y de la base de datos' });
      } catch (dbError) {
        console.error('Error al eliminar contacto de la base de datos', dbError);
        res.status(500).json({ message: 'Error al eliminar contacto de la base de datos', error: dbError });
      }
    } else {
      res.status(response.statusCode).json({ message: 'Error al eliminar contacto en Alegra', body });
    }
  });
};

exports.createContactNoBilling = async (req, res) => {
  let body = req.body;

  body = {
    ...body,
    address: {
        ...body.address,
        country: 'MEX' // Agregar el campo 'country' con el valor 'MEX'
    },
    regimeObject: [body.regime],
    thirdType: 'NATIONAL',
    type: "cliente",
    status: "active"
  };


  try {
    // Preparar la solicitud a Alegra
    const options = {
      method: 'POST',
      url: 'https://api.alegra.com/api/v1/contacts',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Basic ZmFjdHVyYWxpbXBpb3NAaG90bWFpbC5jb206YWI0MTQ2YzQyZjhkMzY3ZjA1MmQ=' // Reemplaza con tu clave de API base64
      },
      body,
      json: true
    };

    // Realizar la solicitud a Alegra usando request-promise
    let alegraResponse;
    try {
      alegraResponse = await rp(options);
    } catch (error) {
      console.error('Error al crear contacto en Alegra', error);
      return res.status(500).json({ message: 'Error al crear contacto en Alegra', error });
    }
    console.log(alegraResponse)


    // Crear el contacto en la base de datos
    const newContact = new Client({
      ...body,
      id: alegraResponse.id // Guarda el ID del contacto en Alegra
    });

    // Guardar el contacto en la base de datos
    const savedContact = await newContact.save();

    res.status(201).json(savedContact);
  } catch (error) {
    console.error('Error al procesar la solicitud', error);
    res.status(500).json({ message: 'Error al procesar la solicitud', error });
  }

};

exports.createContact = async (req, res) => {

  let body = req.body;

  body = {
      ...body,
      address: {
          ...body.address,
          country: 'MEX' // Agregar el campo 'country' con el valor 'MEX'
      },
      regimeObject: [body.regime],
      thirdType: 'NATIONAL',
      type: "cliente",
      status: "active",
      accounting: {
          accountReceivable: {
              categoryRule: {
                  id: "135",
                  name: "Clientes nacionales",
                  key: "NATIONAL_RECEIVABLE_ACCOUNTS_MEX"
              },
              metadata: {
                  satGroupingCode: "",
                  satGroupingText: ""
              },
              id: "5093",
              idParent: "5040",
              name: "Clientes nacionales",
              text: "Clientes nacionales",
              code: null,
              description: "",
              type: "asset",
              readOnly: false,
              nature: "debit",
              blocked: "no",
              status: "active",
              use: "movement",
              showThirdPartyBalance: true
          },
          debtToPay: {
              categoryRule: {
                  id: "137",
                  name: "Proveedores nacionales",
                  key: "NATIONAL_DEBTS_TO_PAY_PROVIDERS_MEX"
              },
              metadata: {
                  satGroupingCode: "",
                  satGroupingText: ""
              },
              id: "5095",
              idParent: "5048",
              name: "Proveedores nacionales",
              text: "Proveedores nacionales",
              code: null,
              description: "",
              type: "liability",
              readOnly: false,
              nature: "credit",
              blocked: "no",
              status: "active",
              use: "movement",
              showThirdPartyBalance: true
          }
      }
  };

  console.log(body)

  try {
    // Preparar la solicitud a Alegra
    const options = {
      method: 'POST',
      url: 'https://api.alegra.com/api/v1/contacts',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Basic ZmFjdHVyYWxpbXBpb3NAaG90bWFpbC5jb206YWI0MTQ2YzQyZjhkMzY3ZjA1MmQ=' // Reemplaza con tu clave de API base64
      },
      body,
      json: true
    };

    // Realizar la solicitud a Alegra usando request-promise
    let alegraResponse;
    try {
      alegraResponse = await rp(options);
    } catch (error) {
      console.error('Error al crear contacto en Alegra', error);
      return res.status(500).json({ message: 'Error al crear contacto en Alegra', error });
    }

    // Crear el contacto en la base de datos
    const newContact = new Client({
      name,
      identification,
      fiscalId,
      thirdType,
      paymentType,
      operationType,
      regime,
      regimeObject,
      paymentMethod,
      cfdiUse,
      address,
      phonePrimary,
      phoneSecondary,
      mobile,
      seller,
      priceList,
      term,
      email,
      type,
      status,
      fax,
      accounting,
      internalContacts: internalContacts || [], // Asegúrate de que sea un array vacío si es null
      ignoreRepeated: ignoreRepeated || false,
      statementAttached: statementAttached || 'no',
      id: alegraResponse.id // Guarda el ID del contacto en Alegra
    });

    // Guardar el contacto en la base de datos
    const savedContact = await newContact.save();

    res.status(201).json(savedContact);
  } catch (error) {
    console.error('Error al procesar la solicitud', error);
    res.status(500).json({ message: 'Error al procesar la solicitud', error });
  }
};

