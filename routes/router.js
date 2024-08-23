const express = require('express')
const router = express.Router()
const multer = require('multer');
const path = require('path');


const productosController = require('../controllers/cobroController/cobroController');
const venta = require('../controllers/venta/ventaController');
//authControler
const auth = require('../controllers/auth/auth')
//chat
const mesaje = require('../controllers/chat/chatController')
router.delete('/chat', mesaje.chatDelete);
//Middlewares
const adminValidate = require('../middlewares/AdminValidate')
const adminVerify = require('../middlewares/AdminVerify') 
const authenticated = require('../middlewares/Authenticated') //si estas autenticado
const logout = require('../middlewares/Logout') //cerrar sesion
const verifyToken = require('../middlewares/VerifyToken') //Si el token expiro
const verifySesion = require('../middlewares/VerifySesion') //Si el token expiro
//funciones por usuario
const userFunctions = require('../controllers/functions/userFunctions')
//funciones franquicia
const franquicia = require('../controllers/franquicia/franquiciaController')
//funciones sucursal
const sucursal = require('../controllers/sucursal/sucursalController')
//Productos
    const productos = require('../controllers/productos/productosController')
    const complementos  = require('../controllers/productos/complementosController')
    //Categorias
    const categorias = require('../controllers/productos/complementos/categoriaController')
    const grupos = require('../controllers/productos/complementos/grupoController')
    const marca = require('../controllers/productos/complementos/marcaController')
    const tipoProducto = require('../controllers/productos/complementos/tipoProductoController')
    const linea = require('../controllers/productos/complementos/lineaController')
    const departamento = require('../controllers/productos/complementos/departamentoController')
    const unidad = require('../controllers/productos/complementos/unidadController')
    const impuesto = require('../controllers/productos/complementos/impuestoController')
    const proveedor = require('../controllers/productos/complementos/proveedorController')



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
router.get('/api/isAdmin', adminVerify.isAdminVerify)

//MiddleWare
router.get('/api/verifySesion', verifySesion.verifyToken)

//funciones por usuario
router.post('/api/auth/functions/add', userFunctions.addFunction)
router.get('/api/auth/functions/:nameRol', userFunctions.getFunctionsByRole)
router.get('/api/functions', userFunctions.getAllFunctions)
router.put('/api/auth/functions/:id', userFunctions.updateFunctionById)
//Funciones Franquicia
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



//productos
router.get('/api/productos', productos.getAll)
router.get('/api/productos/:id', productos.getById)
router.post('/api/productos', productos.create)
router.put('/api/productos/:id', productos.update)
router.delete('/api/productos/:id', productos.deleteById)

    //Complementos
    router.get('/api/complementos', complementos.getAllRecords)

        //Categorias
        router.get('/api/categorias', categorias.getCategorias)
        router.get('/api/categorias/:id', categorias.getCategoriaById)
        router.post('/api/categorias', categorias.createCategoria)
        router.put('/api/categorias/:id', categorias.updateCategoria)
        router.delete('/api/categorias/:id', categorias.deleteCategoria)
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
        router.put('/api/linea/:id', linea.getLineas)
        router.delete('/api/linea/:id', linea.deleteLinea)
        //Departamento
        router.get('/api/departamento', departamento.getDepartamentos)
        router.get('/api/departamento/:id', departamento.getDepartamentoById)
        router.post('/api/departamento', departamento.createDepartamento)
        router.put('/api/departamento/:id', departamento.updateDepartamento)
        router.delete('/api/departamento/:id', departamento.deleteDepartamento)
        //Unidad
        router.get('/api/unidad', unidad.getUnidades)
        router.get('/api/unidad/:id', unidad.getUnidadById)
        router.post('/api/unidad', unidad.createUnidad)
        router.put('/api/unidad/:id', unidad.updateUnidad)
        router.delete('/api/unidad/:id', unidad.deleteUnidad)
        //Impuesto
        router.get('/api/impuesto', impuesto.getImpuestos)
        router.get('/api/impuesto/:id', impuesto.getImpuestoById)
        router.post('/api/impuesto', impuesto.createImpuesto)
        router.put('/api/impuesto/:id', impuesto.updateImpuesto)
        router.delete('/api/impuesto/:id', impuesto.deleteImpuesto)
        //Proveedor
        router.get('/api/proveedor', proveedor.getProveedores)
        router.get('/api/proveedor/:id', proveedor.getProveedorById)
        router.post('/api/proveedor', proveedor.createProveedor)
        router.put('/api/proveedor/:id', proveedor.updateProveedor)
        
        //Tipo Producto
        router.get('/api/tipoProducto', tipoProducto.getTipoProductos)
        router.get('/api/tipoProducto/:id', tipoProducto.getTipoProductoById)
        router.post('/api/tipoProducto', tipoProducto.createTipoProducto)
        router.put('/api/tipoProducto/:id', tipoProducto.updateTipoProducto)
    

//Punto de venta
router.post('/api/productos/load-from-file', productosController.loadProductosFromFile);
router.get('/api/productos/cobros/load', productosController.getAllProductos);
router.post('/api/ventas/crear', venta.createVenta);

module.exports = router