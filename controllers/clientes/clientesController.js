const request = require('request');
const Client = require('../../schemas/clientesSchema/clientesSchema'); // Asegúrate de ajustar la ruta al modelo Client según tu estructura
const rp = require('request-promise');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');


exports.getAllClientesFromBD = async (req, res) => {
  try {
    // Consultar todos los clientes de la base de datos
    const clientes = await Client.find();

    // Verificar si se encontraron clientes
    if (!clientes || clientes.length === 0) {
      return res.status(404).json({ message: 'No se encontraron clientes.' });
    }

    // Responder con los clientes encontrados
    res.status(200).json(clientes);
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
    res.status(500).json({ message: 'Error al obtener los clientes.', error });
  }
};

exports.createContact = async (req, res) => {
  let body = req.body;
  let esFactura = req.body.esFactura

  if (body.esFactura == true) {
    delete body.esFactura;
    body = {
      ...body,
      address: {
        ...body.address,
        country: 'MEX'
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
  } else {
    delete body.esFactura;
    body = {
      ...body,
      address: {
        ...body.address,
        country: 'MEX'
      },
      regimeObject: ['NO_REGIME'],
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
  }

  try {
    // Preparar la solicitud a Alegra
    const options = {
      method: 'POST',
      url: 'https://api.alegra.com/api/v1/contacts',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Basic ZmFjdHVyYWxpbXBpb3NAaG90bWFpbC5jb206YWI0MTQ2YzQyZjhkMzY3ZjA1MmQ='
      },
      body,
      json: true
    };

    // Hacer la solicitud a Alegra
    request(options, async function (error, response, alegraBody) {
      console.log(alegraBody)
      if (error) {
        return res.status(500).json({ error: 'Error al comunicarse con la API de Alegra' });
      }

      // Verificar el estado de la respuesta de Alegra
      if (response.statusCode === 200 || response.statusCode === 201) {
        // Crear el nuevo cliente en la base de datos MongoDB
        try {
          const newClient = new Client({
            esfactura: esFactura,
            estado: 'active',
            monedero: 0,
            clientData: {
              id: alegraBody.id || null,
              name: alegraBody.name || null,
              identification: alegraBody.identification || null,
              email: alegraBody.email || null,
              phonePrimary: alegraBody.phonePrimary || null,
              phoneSecondary: alegraBody.phoneSecondary || null,
              fax: alegraBody.fax || null,
              mobile: alegraBody.mobile || null,
              observations: alegraBody.observations || null,
              status: alegraBody.status || null,
              cfdiUse: alegraBody.cfdiUse || null,
              paymentType: alegraBody.paymentType || null,
              paymentMethod: alegraBody.paymentMethod || null,
              operationType: alegraBody.operationType || null,
              thirdType: alegraBody.thirdType || null,
              fiscalId: alegraBody.fiscalId || null,
              regime: alegraBody.regime || null,
              regimeObject: alegraBody.regimeObject || [],
              address: alegraBody.address || null,
              type: alegraBody.type || [],
              seller: alegraBody.seller || null,
              term: alegraBody.term || null,
              priceList: alegraBody.priceList || null,
              internalContacts: alegraBody.internalContacts || [],
              statementAttached: alegraBody.statementAttached || false,
              accounting: alegraBody.accounting || null
            }
          });

          // Guardar el cliente en la base de datos
          await newClient.save();
          return res.status(201).json({ message: 'Cliente creado y guardado en la BD', data: newClient });
        } catch (dbError) {
          console.error('Error al guardar en la base de datos', dbError);
          return res.status(500).json({ error: 'Error al guardar en la base de datos' });
        }
      } else {
        return res.status(response.statusCode).json({ message: 'Error en la respuesta de Alegra', response: response });
      }
    });
  } catch (error) {
    console.error('Error al procesar la solicitud', error);
    res.status(500).json({ message: 'Error al procesar la solicitud', error });
  }
};

exports.getClienteByClientDataId = async (req, res) => {
  const { clientDataId } = req.params; // Obtener el ID del cliente desde los parámetros de la solicitud

  try {
    // Buscar el cliente con el clientData.id proporcionado
    const cliente = await Client.findOne({ 'clientData.id': clientDataId });

    // Verificar si se encontró el cliente
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado.' });
    }

    // Responder con el cliente encontrado
    res.status(200).json(cliente);
  } catch (error) {
    console.error('Error al obtener el cliente:', error);
    res.status(500).json({ message: 'Error al obtener el cliente.', error });
  }
};

exports.deleteClienteByClientDataId = async (req, res) => {
  const { clientDataId } = req.params; // Obtener el ID del cliente desde los parámetros de la solicitud

  try {
    // Buscar el cliente en tu base de datos
    const cliente = await Client.findOne({ 'clientData.id': clientDataId });

    // Verificar si se encontró el cliente
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado en la base de datos.' });
    }

    // Eliminar el cliente en Alegra
    const options = {
      method: 'DELETE',
      url: `https://api.alegra.com/api/v1/contacts/${clientDataId}`,
      headers: {
        accept: 'application/json',
        authorization: 'Basic bG9wZXpqbzI5OUBnbWFpbC5jb206MDNmZjVkNjMwZjRhNzk2YmZmZjA=' // Asegúrate de usar tu token de autorización
      }
    };

    request(options, async (error, response, body) => {
      if (error) {
        console.error('Error al comunicarse con la API de Alegra:', error);
        return res.status(500).json({ message: 'Error al eliminar el cliente en Alegra.', error });
      }

      if (response.statusCode === 200) {
        // Eliminar el cliente en tu base de datos
        await Client.findOneAndDelete({ 'clientData.id': clientDataId });
        // Responder con éxito
        res.status(200).json({ message: 'Cliente eliminado exitosamente de Alegra y la base de datos.' });
      } else {
        res.status(response.statusCode).json({ message: 'Error al eliminar el cliente en Alegra.', body });
      }
    });

  } catch (error) {
    console.error('Error al eliminar el cliente:', error);
    res.status(500).json({ message: 'Error al eliminar el cliente.', error });
  }
};

exports.updateClient = async (req, res) => {
  const { alegraId } = req.params;
  const { regime, phonePrimary, email } = req.body;

  console.log(alegraId)
  try {
    const client = await Client.findOne({ 'clientData.id': alegraId });

    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado.' });
    }
    
    if (client.esfactura) {
      client.clientData.email = email
      client.clientData.regimeObject = [regime]
      client.clientData.phonePrimary = phonePrimary

    } else {
      client.clientData.email = email
      client.clientData.regimeObject = ['NO_REGIME']
      client.clientData.phonePrimary = phonePrimary
    }

    let json = client.clientData
    console.log(json)

    
    await Client.updateOne({ 'clientData.id': alegraId }, { clientData: json });

    const options = {
      method: 'PUT',
      url: `https://api.alegra.com/api/v1/contacts/${alegraId}`,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Basic bG9wZXpqbzI5OUBnbWFpbC5jb206MDNmZjVkNjMwZjRhNzk2YmZmZjA='
      },
      body: json,
      json: true
    };

    // Enviar solicitud PUT a Alegra
    request(options, async function (error, response, body) {
      if (error) {
        console.error('Error al actualizar en Alegra:', error);
        return res.status(500).json({ message: 'Error al actualizar en Alegra.', error });
      }

      // Verificar respuesta de Alegra
      if (response.statusCode !== 200) {
        return res.status(response.statusCode).json({ message: 'Error al actualizar el cliente en Alegra.', body });
      }

      // Responder con éxito
      res.status(200).json({ message: 'Cliente actualizado exitosamente.', body });
    });

  } catch (error) {
    console.error('Error al actualizar el cliente:', error);
    res.status(500).json({ message: 'Error al actualizar el cliente.', error });
  }
};

exports.updateClientComplete = async (req, res) => {
  const { alegraId } = req.params;
  const {esFactura, name, identification, regime, phonePrimary, email, street ,exteriorNumber,interiorNumber,
    colony, locality, municipality, state, zipCode
   } = req.body;

  try {
    const client = await Client.findOne({ 'clientData.id': alegraId });

    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado.' });
    }
    
    if (esFactura) {
      client.clientData.regimeObject = [regime]
    } else {
      client.clientData.regimeObject = ['SIMPLIFIED_REGIME']
    }
    client.clientData.name = name
    client.clientData.identification = identification
    client.clientData.email = email
    client.clientData.phonePrimary = phonePrimary
    client.clientData.address.street = street
    client.clientData.address.exteriorNumber = exteriorNumber
    client.clientData.address.exteriorNumber = exteriorNumber
    client.clientData.address.interiorNumber = interiorNumber
    client.clientData.address.colony = colony
    client.clientData.address.locality = locality
    client.clientData.address.municipality = municipality
    client.clientData.address.state = state
    client.clientData.address.zipCode = zipCode
    

    let json = client.clientData
    
    await Client.updateOne(
      { 'clientData.id': alegraId }, // Filtro para buscar el cliente
      { $set: { 'esfactura': esFactura, clientData: json } } // Actualiza los campos con $set
    );
    


    const options = {
      method: 'PUT',
      url: `https://api.alegra.com/api/v1/contacts/${alegraId}`,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Basic bG9wZXpqbzI5OUBnbWFpbC5jb206MDNmZjVkNjMwZjRhNzk2YmZmZjA='
      },
      body: json,
      json: true
    };

    // Enviar solicitud PUT a Alegra
    request(options, async function (error, response, body) {
      if (error) {
        console.error('Error al actualizar en Alegra:', error);
        return res.status(500).json({ message: 'Error al actualizar en Alegra.', error });
      }

      // Verificar respuesta de Alegra
      if (response.statusCode != 200) {
        return res.status(response.statusCode).json({ message: 'Error al actualizar el cliente en Alegra.', body });
      }

      // Responder con éxito
      res.status(200).json({ message: 'Cliente actualizado exitosamente.', body });
    });

  } catch (error) {
    console.error('Error al actualizar el cliente:', error);
    res.status(500).json({ message: 'Error al actualizar el cliente.', error });
  }
};

exports.getNombreCliente = async (req, res) => {
  const { id } = req.params;

  console.log(id)
  
  try {
      const cliente = await Client.findById(id).select('clientData');
      if (!cliente) {
          return res.status(404).json({ message: 'Cliente no encontrado' });
      }
      res.json({ cliente: cliente.clientData.name });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor' });
  }
};