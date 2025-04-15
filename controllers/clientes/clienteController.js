//const alegra = require('../../.api/apis/alegra-clientes');
const Client = require('../../schemas/clientesSchema/clientesSchema');
const Facturapi = require('facturapi').default;

const facturapi = new Facturapi('sk_test_GO8zw0Xo52mM1kgLW3a1Y8OydL9Nel4JBEZabDQ3Yv');



exports.createClient = async (req, res) => {
    try {

        const databaseClient = req.body.client
        const facturapiBody = req.body.facturapi 
    
        const customer = await facturapi.customers.create({
            legal_name: facturapiBody.name.toUpperCase(),
            email: facturapiBody.email,
            tax_id: facturapiBody.identification,
            tax_system: facturapiBody.regime,
            address: facturapiBody.address,
            phone: facturapiBody.phonePrimary
        });

        const newClient = new Client({
            idFacApi: customer.id,
            esfactura: databaseClient.esfactura || false,
            estado: databaseClient.estado || true,
            zonaCliente: databaseClient.zonaCliente || null,
            clientData: {
                regime: facturapiBody.regime,
                name: facturapiBody.name,
                identification: facturapiBody.identification,
                mobile: facturapiBody.phonePrimary,
                email: facturapiBody.email,
                address: facturapiBody.address
            },
            monedero: 0, // El monedero inicia en 0
            login: {
                username: facturapiBody.email,
                pasword: databaseClient.login?.pasword || null
            }
        });

        await newClient.save();

        res.status(201).json({
            message: "Cliente creado correctamente",
            facturapi: customer,
            databaseClient: newClient
        });


    } catch (err) {
        console.error("Error al crear cliente:", err);
        res.status(500).json({ message: "Error al crear el cliente", error: err });
    }
};

exports.getClients = async (req, res) => {
    try {
        const clients = await Client.find()
        .populate('zonaCliente').sort({ createdAt: 'asc' });
        res.status(200).json({
            message: "Lista de clientes obtenida con éxito",
            clientes: clients
        });
    } catch (err) {
        console.error("Error al obtener clientes:", err);
        res.status(500).json({ message: "Error al obtener los clientes", error: err.message });
    }
};

exports.getClientById = async (req, res) => {
    try {
        const clientId = req.params.id;

        // Buscar el cliente en la base de datos y popular la zonaCliente
        const client = await Client.findById(clientId).populate('zonaCliente');

        if (!client) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.status(200).json(client);
    } catch (error) {
        console.error("Error al obtener cliente:", error);
        res.status(500).json({ message: "Error al obtener el cliente", error: error.message });
    }
};

exports.deleteClient = async (req, res) => {
    try {
        const clientId = req.params.id; // ID del cliente en MongoDB

        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: "Cliente no encontrado en la base de datos" });
        }

        const idFacApi = client.idFacApi;
        if (!idFacApi) {
            return res.status(400).json({ message: "El cliente no tiene un ID en FacApi" });
        }

        const removedCustomer = await facturapi.customers.del(idFacApi);
        await Client.findByIdAndDelete(clientId);

        res.status(200).json({ message: "Cliente eliminado correctamente" });

    } catch (err) {
        console.error("Error al eliminar cliente:", err);
        res.status(500).json({ message: "Error al eliminar el cliente", error: err.message });
    }
};

exports.updateClient = async (req, res) => {
  try {
    const facturapiData = req.body.facturapi;
    const databaseClient = req.body.client;
    const clientId = req.params.id;

    // 1. Buscar cliente en DB
    const existingClient = await Client.findById(clientId);
    if (!existingClient) {
      return res.status(404).json({ message: 'Cliente no encontrado en la base de datos' });
    }

    // 2. Actualizar en Facturapi
    let facturapiResponse = null;
    if (existingClient.idFacApi) {
      facturapiResponse = await facturapi.customers.update(existingClient.idFacApi, {
        legal_name: facturapiData.name.toUpperCase(),
        email: facturapiData.email,
        tax_id: facturapiData.identification,
        tax_system: facturapiData.regime,
        address: facturapiData.address,
        phone: facturapiData.phonePrimary
      });
    }

    // 3. Actualizar en MongoDB
    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      {
        esfactura: databaseClient.esfactura || false,
        estado: databaseClient.estado || true,
        zonaCliente: databaseClient.zonaCliente || null,
        clientData: {
          regime: facturapiResponse?.tax_system || facturapiData.regime,
          name: facturapiResponse?.legal_name || facturapiData.name,
          identification: facturapiResponse?.tax_id || facturapiData.identification,
          mobile: facturapiData.phonePrimary,
          email: facturapiResponse?.email || facturapiData.email,
          address: facturapiResponse?.address || facturapiData.address
        },
        login: {
          username: facturapiData.email,
          pasword: databaseClient.login?.pasword || existingClient.login.pasword
        }
      },
      { new: true }
    ).populate('zonaCliente');

    if (!updatedClient) {
      return res.status(404).json({ message: 'Error actualizando el cliente en la base de datos' });
    }

    res.status(200).json({
      message: "Cliente actualizado correctamente",
      facturapiClient: facturapiResponse,
      databaseClient: updatedClient
    });

  } catch (err) {
    console.error("Error al actualizar cliente:", err);
    res.status(500).json({ message: "Error al actualizar el cliente", error: err.message });
  }
};

