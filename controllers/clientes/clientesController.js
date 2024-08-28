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


exports.createContact = async (req, res) => {

  const body = req.body;
  console.log(body)

  /*
  const {
    name,
    identification,
    thirdType,
    regime,
    regimeObject,
    address,
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
    internalContacts,
    ignoreRepeated,
    statementAttached
  } = req.body;

  try {
    // Validaciones generales
    if (!name) {
      return res.status(400).json({ message: 'Nombre del contacto es obligatorio.' });
    }
    if (!['FOREIGN', 'NATIONAL'].includes(thirdType)) {
      return res.status(400).json({ message: 'Tipo de tercero inválido.' });
    }

    // Determinar si es necesario facturar
    const isBilling = regime || (regimeObject && Array.isArray(regimeObject) && regimeObject.length > 0);

    // Validaciones específicas si es necesario facturar
    if (isBilling) {
      if (thirdType === 'FOREIGN') {
        if (!identification || identification.length > 45) {
          return res.status(400).json({ message: 'Identificación del contacto es obligatoria y debe tener como máximo 45 caracteres.' });
        }
        if (!fiscalId) {
          return res.status(400).json({ message: 'El RFC es obligatorio si el tipo de tercero es Extranjero.' });
        }
      }
      if (!['PUE', 'PPD'].includes(paymentType)) {
        return res.status(400).json({ message: 'Método de pago inválido.' });
      }
      if (operationType && !['PROFESSIONAL_SERVICES', 'PROPERTY_LEASING', 'OTHERS'].includes(operationType)) {
        return res.status(400).json({ message: 'Tipo de operación inválido.' });
      }
      if (regime && ![
        'NO_REGIME',
        'GENERAL_REGIME_OF_MORAL_PEOPLE_LAW',
        'REGIME_OF_MORAL_PEOPLE_NOT_PROFIT',
        'PRIMARY_SECTOR_REGIME',
        'REGIME_OF_THE_COORDINATED',
        'REGIME_OF_COOPERATIVE_PRODUCTION_SOCIETIES',
        'REGIME_OF_TRUST',
        'SIMPLIFIED_REGIME',
        'SOCIETIES_OPTIONAL_REGIME',
        'BUSINESS_ACTIVITIES_REGIME',
        'FISCAL_INCORPORATION_REGIME',
        'LEASEHOLD_REGIME',
        'REGIME_OF_THE_TECHNOLOGICAL_PLATFORMS_INCOME_ACTIVITIES',
        'SALARIED_REGIME',
        'DIVIDEND_INCOME'
      ].includes(regime)) {
        return res.status(400).json({ message: 'Régimen fiscal inválido.' });
      }
      if (regimeObject && (!Array.isArray(regimeObject) || regimeObject.length === 0)) {
        return res.status(400).json({ message: 'Listado de regimenes fiscales es obligatorio y debe ser un array no vacío.' });
      }
      if (!['cash', 'debit-card', 'credit-card', 'service-card', 'transfer', 'check', 'nominative', 'electronic-wallet', 'electronic-money', 'grocery-voucher', 'dation-payment', 'subrogation-payment', 'allocation-payment', 'forgiveness', 'compensation', 'novation', 'misunderstanding', 'debt-remission', 'prescription-or-expiration', 'creditor-satisfaction', 'other', 'payment-intermediary'].includes(paymentMethod)) {
        return res.status(400).json({ message: 'Forma de pago inválida.' });
      }
      if (!['G01', 'G03', 'I01', 'I02', 'I03', 'I04', 'I05', 'I06', 'I07', 'I08', 'D01', 'D02', 'D03', 'D04', 'D05', 'D06', 'D07', 'D08', 'D09', 'D10', 'P01', 'S01'].includes(cfdiUse)) {
        return res.status(400).json({ message: 'Tipo de CFDI inválido.' });
      }
      if (!address || !address.zipCode || !address.country) {
        return res.status(400).json({ message: 'Dirección es obligatoria, incluyendo código postal y país.' });
      }
      if (address.country === 'NATIONAL' && address.country !== 'MEX') {
        return res.status(400).json({ message: 'El país debe ser MEX si es Nacional.' });
      }
      if (address.country === 'FOREIGN' && address.country === 'MEX') {
        return res.status(400).json({ message: 'El país debe ser distinto de MEX si es Extranjero.' });
      }
    }

    // Preparar la solicitud a Alegra
    const options = {
      method: 'POST',
      url: 'https://api.alegra.com/api/v1/contacts',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Basic ZmFjdHVyYWxpbXBpb3NAaG90bWFpbC5jb206YWI0MTQ2YzQyZjhkMzY3ZjA1MmQ=' // Reemplaza con tu clave de API base64
      },
      body: {
        name,
        identification,
        fiscalId,
        thirdType,
        paymentType,
        operationType,
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
        // Incluye regimen y regimenObject solo si es necesario facturar
        ...(isBilling && {
          regime,
          regimeObject
        })
      },
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
    */
};


exports.createContactNoBilling = async (req, res) => {
  let body = req.body;

  body = {
    ...body,
    address: {
        ...body.address,
        country: 'MEX' // Agregar el campo 'country' con el valor 'MEX'
    },
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
