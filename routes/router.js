const express = require('express')
const router = express.Router()
const multer = require('multer');
const path = require('path');

//Imports
const productosController = require('../controllers/cobroController/cobroController');
const venta = require('../controllers/venta/ventaController');
const auth = require('../controllers/auth/auth')
const mesaje = require('../controllers/chat/chatController')
const adminValidate = require('../middlewares/AdminValidate')
const adminVerify = require('../middlewares/AdminVerify') 
const authenticated = require('../middlewares/Authenticated')
const logout = require('../middlewares/Logout') 
const verifyToken = require('../middlewares/VerifyToken')
const verifySesion = require('../middlewares/VerifySesion') 
const userFunctions = require('../controllers/functionsUsers/userFunctions')
const franquicia = require('../controllers/franquicia/franquiciaController')
const sucursal = require('../controllers/sucursal/sucursalController')
const productos = require('../controllers/productos/productosController')
const grupos = require('../controllers/productos/complementos/grupoController')
const marca = require('../controllers/productos/complementos/marcaController')
const linea = require('../controllers/productos/complementos/lineaController')
const departamento = require('../controllers/productos/complementos/departamentoController')
const clientes = require('../controllers/clientes/clientesController')
const kardex = require('../controllers/kardex/kardexController')
const proveedor = require('../controllers/proveedor/proveedorController')




//Vistas
router.get('/login', (req, res) => {    
    res.render('login');
});

router.get('/main', authenticated.isAuthenticated, verifyToken.verifyToken, (req, res) => {    
    res.render('main');
});

router.get('/usuarios', authenticated.isAuthenticated, verifyToken.verifyToken, adminValidate.isAdmin, (req, res) => {    
    res.render('Users/usuarios');
});

router.get('/franquicias', authenticated.isAuthenticated, verifyToken.verifyToken, adminValidate.isAdmin, (req, res) => {    
    res.render('Franquicias/franquicias');
});

router.get('/tiendas', authenticated.isAuthenticated,  verifyToken.verifyToken, adminValidate.isAdmin, (req, res) => {    
    res.render('Sucursales/sucursales');
});

router.get('/puntoDeVenta', authenticated.isAuthenticated,  verifyToken.verifyToken, (req, res) => {    
    res.render('PuntoDeVenta/puntoDeVenta');
});

router.get('/productos', authenticated.isAuthenticated,  verifyToken.verifyToken, adminValidate.isAdmin, (req, res) => {    
    res.render('Productos/productos');
});

router.get('/ventasGenerales', authenticated.isAuthenticated,  verifyToken.verifyToken, adminValidate.isAdmin, (req, res) => {    
    res.render('Reportes/ventasGenerales');
});

router.get('/clientes', (req, res) => {    
    res.render('Clientes/clientes');
});

router.get('/kardex', (req, res) => {    
    res.render('Kardex/kardex');
});
router.get('/ventas', (req, res) => {    
    res.render('Ventas/ventas');
});

router.get('/proveedor', (req, res) => {    
    res.render('Proveedor/proveedor');
});




//Funciones al API

//Auth
router.post('/api/auth/register', auth.registerUser)
router.post('/api/auth/login', auth.login)
router.get('/api/auth/users', auth.getAllUsers)
router.get('/api/auth/users/:id', auth.getUserById)
router.get('/api/auth/users/:id', auth.getUserById)
router.put('/api/auth/users/:id', auth.updateUserById)
router.put('/api/auth/users/password/:id', auth.updatePassword)
router.delete('/api/auth/users/:id', auth.deleteUserById);
router.put('/api/auth/users/status/:id', auth.updateUserStatus)
router.get('/logout', logout.logout)

//MiddleWare
router.get('/api/verifySesion', verifySesion.verifyToken)
router.get('/api/isAdmin', adminVerify.isAdminVerify)

//Usuarios
router.post('/api/auth/functions/add', userFunctions.addFunction)
router.get('/api/auth/functions/:nameRol', userFunctions.getFunctionsByRole)
router.get('/api/functions', userFunctions.getAllFunctions)
router.put('/api/auth/functions/:id', userFunctions.updateFunctionById)

//Franquicia
router.post('/api/franquicia/add', franquicia.addFranquicia)
router.get('/api/franquicia', franquicia.getFranquicias)
router.get('/api/franquicia/:id', franquicia.getIndividualFranquicia);
router.delete('/api/franquicia/:id', franquicia.deleteFranquicia);
router.put('/api/franquicia/:id', franquicia.editFranquicia);

//funciones sucursal
router.post('/api/sucursal/add', sucursal.addSucursal)
router.get('/api/sucursal/:clave', sucursal.getSucursalByClave)
router.get('/api/sucursal', sucursal.getAllSucursales)
router.get('/api/sucursal/franquicia/:idFranquicia', sucursal.getSucursalesByFranquicia)
router.get('/api/sucursal/id/:id', sucursal.getSucursalById)
router.put('/api/sucursal/id/:id', sucursal.updateSucursalById)
router.delete('/api/sucursal/id/:id', sucursal.deleteSucursalById)

//Productos
router.post('/api/loadProductosFromExcelToBDtoAlegra', productos.createProductFromExcel)

router.post('/api/productos', productos.createProduct)
router.get('/api/productos', productos.getAllProducts)
router.get('/api/productos/:id', productos.getProductById)
router.delete('/api/productos/:id', productos.deleteProductById)
router.put('/api/productos/:id', productos.updateProduct)
router.put('/api/productosStatus/:id', productos.updateProduct)

    //Complementos
        //grupos
        router.get('/api/grupos', grupos.getGrupos)
        router.get('/api/grupos/:id', grupos.getGrupoById)
        router.post('/api/grupos', grupos.createGrupo)
        router.put('/api/grupos/:id', grupos.updateGrupo)
        router.delete('/api/grupos/:id', grupos.deleteGrupo)
        //Marca
        router.get('/api/marca', marca.getMarcas)
        router.get('/api/marca/:id', marca.getMarcaById)
        router.post('/api/marca', marca.createMarca)
        router.put('/api/marca/:id', marca.updateMarca)
        router.delete('/api/marca/:id', marca.deleteMarca)
        //Linea
        router.get('/api/linea', linea.getLineas)
        router.get('/api/linea/:id', linea.getLineaById)
        router.post('/api/linea', linea.createLinea)
        router.put('/api/linea/:id', linea.updateLinea)
        router.delete('/api/linea/:id', linea.deleteLinea)
        //Departamento
        router.get('/api/departamento', departamento.getDepartamentos)
        router.get('/api/departamento/:id', departamento.getDepartamentoById)
        router.post('/api/departamento', departamento.createDepartamento)
        router.put('/api/departamento/:id', departamento.updateDepartamento)
        router.delete('/api/departamento/:id', departamento.deleteDepartamento)



        

    

//Punto de venta
router.post('/api/productos/load-from-file', productosController.loadProductosFromFile);
router.get('/api/productos/cobros/load', productosController.getAllProductos);
router.post('/api/ventas/crear', venta.createVenta);
router.post('/api/productos/put', productosController.actualizarProductosConProductKey);
router.post('/api/productos/id', productosController.actualizarProductosConExcel);
    //ventas
    router.post('/api/ventas', venta.createVenta);
    router.get('/api/ventas/:sucursal/:fechaInicio/:fechaFin', venta.getVentasPorSucursalYFechas)
    router.get('/api/venta/:id', venta.getVentaPorId)



//Clientes 
router.get('/api/clientes', clientes.getAllClientesFromBD);
router.post('/api/clientes', clientes.createContact);
router.get('/api/clientes/:clientDataId', clientes.getClienteByClientDataId);
router.delete('/api/clientes/:clientDataId', clientes.deleteClienteByClientDataId);
router.put('/api/clientes/:alegraId', clientes.updateClient);
router.put('/api/clientesUpdateCompleto/:alegraId', clientes.updateClientComplete);
router.get('/api/clientesNombre/:id', clientes.getNombreCliente);


//Proveedor
router.get('/api/proveedor', proveedor.getProveedores)
router.get('/api/proveedor/:id', proveedor.getProveedorById)
router.post('/api/proveedor', proveedor.addProveedor)
router.put('/api/proveedor/:id', proveedor.updateProveedor)
router.delete('/api/proveedor/:id', proveedor.deleteProveedor)



//chat
router.delete('/chat', mesaje.chatDelete);
router.get('/api/ventasMainInfo', venta.getVentasDelDia);

//Kardex
router.post('/api/kardex', kardex.createKardex)
router.get('/api/kardex', kardex.getAllKardex)
router.delete('/api/kardex/:id', kardex.deleteKardexById)



module.exports = router