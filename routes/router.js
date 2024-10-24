const express = require('express')
const router = express.Router()

//Imports
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
const unidad = require('../controllers/productos/complementos/unidadController')
const impuesto = require('../controllers/productos/complementos/impuestoController')
const clientes = require('../controllers/clientes/clientesController')
const kardex = require('../controllers/kardex/kardexController')
const proveedor = require('../controllers/proveedor/proveedorController')
const materiasPrimas = require('../controllers/materiaPrima/materiaPrimaController')
const formulasProduccion = require('../controllers/formulas/formulasController')
const cortesParciales = require('../controllers/cortes/cortesParcialesController')
const cortesFinales = require('../controllers/cortes/cortesFinalesController')
const recepcionCortes = require('../controllers/cortes/recepcionCortesController')


router.get('/', (req, res) => {    
    res.render('index');
});

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

router.get('/materiasPrimas', (req, res) => {    
    res.render('MateriasPrimas/materiasPrimas');
});

router.get('/formulas', (req, res) => {    
    res.render('Formulas/formulasProduccion');
});

router.get('/corteparcial', (req, res) => {    
    res.render('Cortes/cortesParciales');
});

router.get('/corteVenta', (req, res) => {    
    res.render('Cortes/cortesVenta');
});

router.get('/cortesRecoleccion', (req, res) => {    
    res.render('Cortes/cortesRecoleccion');
});

router.get('/listadoCortesVenta', (req, res) => {    
    res.render('Cortes/listadoCortesVenta');
});

router.get('/factura', (req, res) => {    
    res.render('Facturar/factura');
});

router.get('/monedero', (req, res) => {    
    res.render('Monedero/monedero');
});

router.get('/preciador', (req, res) => {    
    res.render('Preciador/preciador');
});

router.get('/codigosBarras', (req, res) => {    
    res.render('CodigosBarras/codigosBarras');
});





//Funciones al API
router.post('/api/auth/register', auth.registerUser)
router.post('/api/auth/login', auth.login)
//Auth

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
router.put('/api/productos/:id', productos.updateProductPrice)
router.get('/api/productos/:id', productos.getProductById)


router.get('/api/preciador/:sucursalId', productos.getPreciadorBySucursal)
router.post('/api/preciador', productos.marcarProductoImpreso)

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
        //Impuesto
        router.get('/api/impuesto', impuesto.getImpuestos)
        router.get('/api/impuesto/:id', impuesto.getImpuestoById)
        router.post('/api/impuesto', impuesto.createImpuesto)
        router.put('/api/impuesto/:id', impuesto.updateImpuesto)
        router.delete('/api/impuesto/:id', impuesto.deleteImpuesto)
        //Unidad
        router.get('/api/unidad', unidad.getUnidades)
        router.get('/api/unidad/:id', unidad.getUnidadById)
        router.post('/api/unidad', unidad.createUnidad)
        router.put('/api/unidad/:id', unidad.updateUnidad)
        router.delete('/api/unidad/:id', unidad.deleteUnidad)


        

    

//Punto de venta
router.post('/api/ventas/crear', venta.createVenta);

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


//materiasPrimas
router.get('/api/materiasPrimas', materiasPrimas.getMateriasPrimas)
router.get('/api/materiasPrimas/:id', materiasPrimas.getMateriaPrimaById)
router.post('/api/materiasPrimas', materiasPrimas.addMateriaPrima)
router.put('/api/materiasPrimas/:id', materiasPrimas.updateMateriaPrima)
router.delete('/api/materiasPrimas/:id', materiasPrimas.deleteMateriaPrima)

//Formulas de produccion
router.get('/api/formulasProduccion', formulasProduccion.getFormulasProduccion)
router.get('/api/formulasProduccion/:id', formulasProduccion.getFormulaProduccionById)
router.post('/api/formulasProduccion', formulasProduccion.addFormulaProduccion)
router.put('/api/formulasProduccion/:id', formulasProduccion.updateFormulaProduccion)
router.delete('/api/formulasProduccion/:id', formulasProduccion.deleteFormulaProduccion)

//Cortes Parciales
router.get('/api/cortesParciales', cortesParciales.getCortesParciales)
router.get('/api/cortesParciales/:id', cortesParciales.getCorteParcialById)
router.post('/api/cortesParciales', cortesParciales.addCorteParcial)
router.put('/api/cortesParciales/:id', cortesParciales.updateCorteParcial)
router.delete('/api/cortesParciales/:id', cortesParciales.deleteCorteParcial)
router.get('/api/cortes/verificar/:userId', cortesParciales.verificarCortePendiente);

//Cortes Finales
router.get('/api/cortesFinales', cortesFinales.getCortesFinales)
router.get('/api/cortesFinales/:id', cortesFinales.getCorteFinalById)
router.post('/api/cortesFinales', cortesFinales.addCorteFinal)
router.put('/api/cortesFinales/:id', cortesFinales.updateCorteFinalById)
router.delete('/api/cortesFinales/:id', cortesFinales.deleteCorteFinalById)

router.get('/api/cortesFinalesUser/:userId', cortesFinales.getResumenCorte)



//Recepcion Cortes
router.post('/api/recepcion/cortes', recepcionCortes.updateEstadoCortes)


const codigosBarras = require('../controllers/codigosBarras/codigosBarrasController')
router.post('/api/codigosBarras', codigosBarras.generarCodigoDeBarras)
router.post('/api/codigosBarras/productos', codigosBarras.generarCodigoDeBarrasProductos) 


module.exports = router