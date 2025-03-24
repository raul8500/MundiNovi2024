//const alegra = require('../../.api/apis/alegra-clientes');
const Client = require('../../schemas/clientesSchema/clientesSchema');
const alegra = ''
// Configuración de autenticación
//alegra.auth('facturalimpios@hotmail.com', 'ab4146c42f8d367f052d');

exports.createClient = async (req, res) => {
    try {
        const alegraClient = req.body.alegra;
        const databaseClient = req.body.client;

        // Enviar el cliente a Alegra
        const alegraResponse = await alegra.postContacts({
            address: alegraClient.address,
            thirdType: alegraClient.thirdType || 'NATIONAL',
            regime: alegraClient.regime || 'NO_REGIME',
            name: alegraClient.name,
            identification: alegraClient.identification,
            regimeObject: [alegraClient.regime] || ['NO_REGIME'],
            phonePrimary: alegraClient.phonePrimary,
            mobile: alegraClient.mobile,
            email: alegraClient.email,
            status: alegraClient.status || 'active'
        });
        
        // Guardar el cliente en la base de datos (MongoDB)
        const newClient = new Client({
            idAlegra: alegraResponse.data.id,
            esfactura: databaseClient.esfactura || false,
            estado: databaseClient.estado || true,
            zonaCliente: databaseClient.zonaCliente || null,
            clientData: {
                thirdType: alegraResponse.data.thirdType,
                regime: alegraResponse.data.regime,
                name: alegraResponse.data.name,
                identification: alegraResponse.data.identification,
                regimeObject: alegraResponse.data.regimeObject,
                phonePrimary: alegraResponse.data.phonePrimary,
                mobile: alegraResponse.data.phonePrimary,
                email: alegraResponse.data.email,
                status: alegraResponse.data.status,
                address: alegraResponse.data.address
            },
            monedero: 0, // El monedero inicia en 0
            login: {
                username: alegraResponse.data.phonePrimary, // El username es el número telefónico
                pasword: databaseClient.login?.pasword || null // Contraseña opcional
            }
        });

        await newClient.save();

        res.status(201).json({
            message: "Cliente creado correctamente",
            alegraClient: alegraResponse.data,
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

        // Buscar el cliente en MongoDB
        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: "Cliente no encontrado en la base de datos" });
        }

        const idAlegra = client.idAlegra;
        if (!idAlegra) {
            return res.status(400).json({ message: "El cliente no tiene un ID en Alegra" });
        }

        // Eliminar el cliente de Alegra
        await alegra.deleteContact({ id: idAlegra });

        // Eliminar el cliente de MongoDB
        await Client.findByIdAndDelete(clientId);

        res.status(200).json({ message: "Cliente eliminado correctamente" });

    } catch (err) {
        console.error("Error al eliminar cliente:", err);
        res.status(500).json({ message: "Error al eliminar el cliente", error: err.message });
    }
};

exports.updateClient = async (req, res) => {
    try {
        const alegraClient = req.body.alegra;
        const databaseClient = req.body.client;
        const clientId = req.params.id; // ID del cliente en MongoDB

        // Buscar el cliente en la base de datos para obtener el idAlegra
        const existingClient = await Client.findById(clientId);
        if (!existingClient) {
            return res.status(404).json({ message: 'Cliente no encontrado en la base de datos' });
        }

        // Actualizar el cliente en Alegra
        const alegraResponse = await alegra.editContact({
            address: alegraClient.address,
            thirdType: alegraClient.thirdType || 'NATIONAL',
            regime: alegraClient.regime || 'NO_REGIME',
            name: alegraClient.name,
            identification: alegraClient.identification,
            regimeObject: [alegraClient.regime] || ['NO_REGIME'],
            phonePrimary: alegraClient.phonePrimary,
            mobile: alegraClient.mobile,
            email: alegraClient.email,
            status: alegraClient.status || 'active'
        }, { id: existingClient.idAlegra });

        console.log("Cliente actualizado en Alegra:", alegraResponse.data);

        // Actualizar el cliente en MongoDB
        const updatedClient = await Client.findByIdAndUpdate(clientId, {
            esfactura: databaseClient.esfactura || false,
            estado: databaseClient.estado || true,
            zonaCliente: databaseClient.zonaCliente || null,
            clientData: {
                thirdType: alegraResponse.data.thirdType,
                regime: alegraResponse.data.regime,
                name: alegraResponse.data.name,
                identification: alegraResponse.data.identification,
                regimeObject: alegraResponse.data.regimeObject,
                phonePrimary: alegraResponse.data.phonePrimary,
                mobile: alegraResponse.data.phonePrimary,
                email: alegraResponse.data.email,
                status: alegraResponse.data.status,
                address: alegraResponse.data.address
            },
            login: {
                username: alegraResponse.data.phonePrimary,
                pasword: databaseClient.login?.pasword || existingClient.login.pasword
            }
        }, { new: true }).populate('zonaCliente');

        if (!updatedClient) {
            return res.status(404).json({ message: 'Error actualizando el cliente en la base de datos' });
        }

        res.status(200).json({
            message: "Cliente actualizado correctamente",
            alegraClient: alegraResponse.data,
            databaseClient: updatedClient
        });

    } catch (err) {
        console.error("Error al actualizar cliente:", err);
        res.status(500).json({ message: "Error al actualizar el cliente", error: err.message });
    }
};
