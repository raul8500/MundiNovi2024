//const alegra = require('../../.api/apis/alegra-clientes');
const Client = require('../../schemas/clientesSchema/clientesSchema');
const Facturapi = require('facturapi').default;
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Venta = require('../../schemas/venta/ventaSchema');

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
                username: facturapiBody.phonePrimary,
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
          username: facturapiData.phonePrimary,
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



//registro de clientes compradores
exports.completarRegistro = async (req, res) => {
  try {
    const { correo, telefono, password } = req.body;

    // 1. Buscar cliente por correo y teléfono
    const existingClient = await Client.findOne({
      'clientData.email': correo,
      'login.username': telefono
    });

    if (!existingClient) {
      return res.status(404).json({ message: 'Cliente no encontrado con esos datos' });
    }

    // 2. Validar que no tenga ya contraseña
    if (existingClient.login?.pasword) {
      return res.status(409).json({ message: 'El registro ya fue completado anteriormente' });
    }

    // 3. Encriptar contraseña con bcryptjs
    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(password, salt);

    // 4. Guardar contraseña encriptada
    existingClient.login.pasword = hashedPassword;
    await existingClient.save();

    res.status(200).json({ message: 'Registro completado exitosamente' });

  } catch (err) {
    console.error('Error al completar registro:', err);
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};

exports.loginCustomer = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar cliente por nombre de usuario (teléfono)
    const client = await Client.findOne({ 'login.username': username });

    if (!client) {
      return res.status(401).json({ error: 'Teléfono o contraseña incorrectos' });
    }

    // Validar estado del cliente
    if (client.estado === false) {
      return res.status(403).json({ error: 'Tu cuenta está inactiva. Contacta al administrador.' });
    }

    // Validar contraseña
    const passwordMatch = await bcryptjs.compare(password, client.login.pasword);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Teléfono o contraseña incorrectos' });
    }

    // Crear token JWT
    const token = jwt.sign({ id: client._id }, process.env.JWT_SECRETO, {
      expiresIn: process.env.JWT_TIEMPO_EXPIRA
    });

    // Establecer cookie JWT
    const expiresInDays = parseInt(process.env.JWT_COOKIE_EXPIRES, 10);
    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + expiresInDays);

    res.cookie('jwt', token, {
      expires: expiresDate,
      httpOnly: true
    });

    console.log({
      message: 'Inicio de sesión exitoso',
      token,
      name: client.clientData?.name,
      user: client.login.username,
      date: new Date()
    });

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      name: client.clientData?.name,
      username: client.login.username
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.verifyClienteToken = async (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRETO);

    // Buscar al cliente por ID
    const cliente = await Client.findById(decoded.id).select('-login.pasword');

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado.' });
    }

    // Devolver la información del cliente
    return res.json(cliente);
  } catch (error) {
    console.error('Error al verificar token de cliente:', error);
    return res.status(401).json({ message: 'Token inválido.' });
  }
};

exports.getVentasPorCliente = async (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRETO);

    // Buscar cliente autenticado
    const cliente = await Client.findById(decoded.id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado.' });
    }

    // Buscar todas las ventas asociadas al cliente
    const ventas = await Venta.find({ cliente: cliente._id })
      .populate('vendedor', 'username') // puedes ajustar si necesitas más datos
      .populate('sucursal', 'nombre')
      .populate('productos.id', 'nombre') // opcional si quieres el nombre del producto
      .sort({ fecha: -1 });

    res.status(200).json({ ventas });

  } catch (error) {
    console.error('Error al recuperar ventas del cliente:', error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

exports.updateClienteDatosPersonales = async (req, res) => {
  try {
    const clienteId = req.params.id;
    const datos = req.body.facturapi;

    if (!datos || !datos.name || !datos.identification) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    const clienteExistente = await Client.findById(clienteId);
    if (!clienteExistente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    const direccion = {
      street: datos.address?.street || '',
      exterior: datos.address?.exterior || '',
      interior: datos.address?.interior || '',
      neighborhood: datos.address?.neighborhood || '',
      zip: datos.address?.zip || '',
      city: datos.address?.city || '',
      municipality: datos.address?.municipality || '',
      state: datos.address?.state || '',
      country: 'MX'
    };

    let respuestaFacturapi = null;

    if (clienteExistente.idFacApi) {
      try {
        respuestaFacturapi = await facturapi.customers.update(clienteExistente.idFacApi, {
          legal_name: datos.name.toUpperCase(),
          email: datos.email,
          tax_id: datos.identification,
          tax_system: datos.regime,
          address: direccion,
          phone: datos.phonePrimary
        });
      } catch (facturapiError) {
        console.error('Error al actualizar en Facturapi:', facturapiError);
        return res.status(400).json({
          message: 'Error al actualizar en Facturapi',
          facturapiError: true,
          error: facturapiError.message || 'Error en los datos enviados a Facturapi'
        });
      }
    }

    const clienteActualizado = await Client.findByIdAndUpdate(
      clienteId,
      {
        clientData: {
          name: datos.name.toUpperCase(),
          identification: datos.identification,
          email: datos.email,
          mobile: datos.phonePrimary,
          regime: datos.regime,
          address: direccion
        }
      },
      { new: true }
    );

    res.status(200).json({
      message: 'Datos personales actualizados correctamente',
      cliente: clienteActualizado,
      facturapi: respuestaFacturapi
    });

  } catch (error) {
    console.error('Error al actualizar datos personales:', error);
    res.status(500).json({
      message: 'Ocurrió un error al actualizar los datos',
      error: error.message
    });
  }
};

