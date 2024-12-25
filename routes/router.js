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
const asistencia = require('../controllers/asistencia/asistenciaController')
const produccion = require('../controllers/produccion/produccion')
const actividades = require('../controllers/actividades/actividadesController')
const multer = require('../middlewares/multer'); // Configuración de Multer
const capacitacionController = require('../controllers/capacitacion/capacitacionController');
const stocksController = require('../controllers/stocks/stocksController');
const codigosBarras = require('../controllers/codigosBarras/codigosBarrasController')
const arqueoEfectivo = require('../controllers/arqueos/efectivo/arqueoEfectivoController')
const evaluaciones = require('../controllers/evaluaciones/evaluacionesController')
const actaController = require('../controllers/actaAdministrativa/actasController');
const tipoActaController = require('../controllers/actaAdministrativa/tipoActaController');
const parametros = require('../controllers/evaluaciones/parametrosController');
const inventario = require('../controllers/inventarios/inventariosController');
const inventarioMateriaPrima = require('../controllers/inventarios/inventariosMPrima');
const egresos = require('../controllers/egresos/egresosController');
const cotizacion = require('../controllers/cotizaciones/cotizacionesController');
const pedidos = require('../controllers/pedido/pedidoControlle');


const multerw = require('multer');
const upload = multerw({ dest: 'uploads/' }); // Carpeta temporal para archivos
const path = require('path');


const storage = multerw.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Carpeta donde se guardan los archivos
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname); // Obtener extensión del archivo
        cb(null, uniqueSuffix + ext); // Guardar con la extensión
    }
});

const upload2 = multerw({ storage });




router.get('/', (req, res) => {    
    res.render('index');
});


//Vistas
router.get('/login', (req, res) => {    
        res.render('login', { hideHeader: true });
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

router.get('/kardexMateriasPrimas', (req, res) => {    
    res.render('Kardex/kardexMeteriaPrima.ejs');
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

router.get('/asistencias', (req, res) => {    
    res.render('Asistencias/asistenciaAdmin');
});

router.get('/asistenciaUsuario', (req, res) => {    
    res.render('Asistencias/asistencia');
});




router.get('/fabricarFormula', (req, res) => {    
    res.render('Produccion/fabricarFormulas');
});

router.get('/producciones', (req, res) => {    
    res.render('Produccion/produccionAdmin');
});

router.get('/actividadesAdmin', (req, res) => {    
    res.render('Actividades/actividadesAdmin');
});

router.get('/actividades', (req, res) => {    
    res.render('Actividades/actividadesUser');
});

router.get('/capacitacionesAdmin', (req, res) => {    
    res.render('Capacitaciones/capacitacionesAdmin');
});

router.get('/capacitaciones', (req, res) => {    
    res.render('Capacitaciones/capacitacionesUser');
});

router.get('/examenesAdmin', (req, res) => {    
    res.render('Capacitaciones/Admin/examenesAdmin');
});

router.get('/examenes', (req, res) => {    
    res.render('Capacitaciones/User/examenes');
});

router.get('/documentosAdmin', (req, res) => {    
    res.render('Capacitaciones/Admin/documentosAdmin');
});
router.get('/documentos', (req, res) => {    
    res.render('Capacitaciones/User/documentos');
});

router.get('/paginasAdmin', (req, res) => {    
    res.render('Capacitaciones/Admin/paginasAdmin');
});
router.get('/paginas', (req, res) => {    
    res.render('Capacitaciones/User/paginas');
});

router.get('/videosAdmin', (req, res) => {    
    res.render('Capacitaciones/Admin/videosAdmin');
});
router.get('/videos', (req, res) => {    
    res.render('Capacitaciones/User/videos');
});

router.get('/arqueoEfectivo', (req, res) => {    
    res.render('Arqueos/efectivo/arqueoEfectivo');
});

router.get('/arqueosEfectivo', (req, res) => {    
    res.render('Arqueos/efectivo/arqueoEfectivoAdmin');
});

router.get('/evaluacionSucursal', (req, res) => {    
    res.render('Evaluaciones/evaluacionesSucursal');
});

router.get('/evaluacionAdmin', (req, res) => {    
    res.render('Evaluaciones/evaluacionesAdmin');
});

router.get('/actasAdministrativas', (req, res) => {    
    res.render('Actas/actasAdministrativas');
});

router.get('/importaciones', (req, res) => {    
    res.render('Importaciones/importaciones');
});

router.get('/importacionesStock', (req, res) => {    
    res.render('Importaciones/stoc/stoc');
});


router.get('/listadoInventarios', (req, res) => {    
    res.render('Inventarios/inventariosAdmin');
});

router.get('/arqueoSupervisor', (req, res) => {    
    res.render('Arqueos/productos/arqueoSupervisor');
});

router.get('/arqueoProductos', (req, res) => {    
    res.render('Arqueos/productos/arqueosUsuario');
});

router.get('/arqueoMatPrima', (req, res) => {    
    res.render('Arqueos/materiaPrima/arqueoMatPrima');
});

router.get('/egresosAdmin', (req, res) => {    
    res.render('Egresos/egresosAdmin');
});

router.get('/egresos', (req, res) => {    
    res.render('Egresos/egresosUser');
});

router.get('/cotizacionAdmin', (req, res) => {    
    res.render('Cotizaciones/cotizacionesAdmin');
});

router.get('/crearPedido', (req, res) => {
    const { id } = req.params;
    res.render('Pedido/crearPedido', { cotizacionId: id });
});

router.get('/pedidosPorEntregar', (req, res) => {    
    res.render('Pedido/pedidosPorEntregar');
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
router.post('/api/kardexSinCosto', kardex.createKardexSinCosto)
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

router.post('/api/codigosBarras', codigosBarras.generarCodigoDeBarras)
router.post('/api/codigosBarras/productos', codigosBarras.generarCodigoDeBarrasProductos) 




//Asistencia
router.post('/api/registrarEntrada', asistencia.registrarEntrada) 
router.post('/api/registrarSalidaComer', asistencia.registrarSalidaComer) 
router.post('/api/registrarRegresoComer', asistencia.registrarRegresoComer) 
router.post('/api/registrarTerminoJornada', asistencia.registrarTerminoJornada) 
router.get('/api/getAllAsistencias', asistencia.getAllAsistencias) 
router.get('/api/getAsistenciaByUsuarioForToday/:usuarioId', asistencia.getAsistenciaByUsuarioForToday) 


//Produccion
router.get('/api/formulasPorProducir', produccion.getFormulasProduccion) 
router.get('/api/formulasPorProducir/:id', produccion.getFormulaProduccionById)
router.post('/api/producirFormula', produccion.registrarProduccion)
router.get('/api/recuperarProducciones', produccion.getAllProducciones)
router.get('/api/recuperarProducciones/:id', produccion.getProduccionById)
router.put('/api/cancelarProduccion/:id', produccion.cancelarProduccion)
router.put('/api/confirmarProduccion/:produccionId', produccion.confirmarProduccion) 
router.delete('/api/eliminarProduccion/:id', produccion.eliminarProduccion) 


//actividades
router.post('/api/crearActividad', actividades.crearActividad)
router.get('/api/obtenerActividadesPorUsuario/:usuarioId', actividades.obtenerActividadesPorUsuario)
router.get('/api/obtenerActividadPorId/:actividadId', actividades.obtenerActividadPorId)
router.get('/api/obtenerTodasLasActividades', actividades.obtenerTodasLasActividades)
router.put('/api/marcarComoFinalizada/:actividadId', actividades.marcarComoFinalizada)
router.delete('/api/eliminarActividad/:actividadId', actividades.eliminarActividad)
router.put('/api/excluirDiaEspecifico/:actividadId', actividades.excluirDiaEspecifico)
router.post('/api/marcarEstadoPorFecha/:actividadId', actividades.marcarEstadoPorFecha)
router.post('/api/reagendar/:id', actividades.reagendarActividad )




//Capacitacion
router.post('/api/capacitaciones', multer.single('archivo'), capacitacionController.crearCapacitacion);
router.post('/api/crearCapacitacionSinArchivo', capacitacionController.crearCapacitacionSinArchivo);
router.get('/api/obtenerCapacitaciones', capacitacionController.obtenerCapacitaciones);
router.get('/api/capacitaciones/:id/descargar', capacitacionController.descargarArchivo);
router.delete('/api/capacitaciones/:id', capacitacionController.eliminarCapacitacion);
    //examnes
router.post('/api/examenes', capacitacionController.crearExamen); // Listar todos los exámenes
router.get('/api/examenes', capacitacionController.listarExamenes); // Listar todos los exámenes
router.get('/api/examenes/usuario/:tipoUsuario/:usuarioId', capacitacionController.listarExamenesPorUsuario); // Listar exámenes por tipo de usuario
router.post('/api/examenes/:examenId/responder', capacitacionController.responderExamen); // Responder un examen
router.get('/api/respuestas/:examenId', capacitacionController.listarRespuestas); // Listar respuestas por usuario
router.patch('/api/examenes/:examenId/estado', capacitacionController.cambiarEstadoExamen); // Activar/Desactivar examen
router.delete('/api/examenes/:id', capacitacionController.eliminarExamen); // Eliminar todos los exámenes
router.get('/api/examenes/:id', capacitacionController.obtenerExamenPorId); //get por id
router.put('/api/examenes/:id', capacitacionController.actualizarExamen); //get por id


//Exportar a excel productos 
router.get('/api/exportarProductos', productos.exportarProductosAExcel);

//stocks
router.get('/api/reporte/:sucursalId',stocksController.generarReporteStocks);
router.post('/api/actualizar/:sucursalId', upload.single('file'), stocksController.actualizarStocks);


//arqueo efectivo

router.post('/api/arqueo', arqueoEfectivo.crearArqueo);
router.get('/api/arqueo', arqueoEfectivo.getAllArqueos);
router.get('/api/arqueo/:id', arqueoEfectivo.getArqueoById);
router.delete('/api/arqueo/:id', arqueoEfectivo.deleteArqueo);

//evaluaciones

router.post('/api/evaluaciones', evaluaciones.addEvaluacion);
router.get('/api/evaluaciones', evaluaciones.getAllEvaluaciones);
router.get('/api/evaluaciones/:id', evaluaciones.getEvaluacionById);
router.put('/api/evaluaciones/:id', evaluaciones.updateEvaluacion);
router.delete('/api/evaluaciones/:id', evaluaciones.deleteEvaluacion);

//parametros
router.post('/api/parametros', parametros.addParametro);
router.get('/api/parametros', parametros.getParametros);
router.get('/api/parametros/:id', parametros.getParametroById);
router.put('/api/parametros/:id', parametros.updateParametro);
router.delete('/api/parametros/:id', parametros.deleteParametro);

//actas ADministrativas

router.post('/api/actas', actaController.crearActa);
router.get('/api/actas/:id', actaController.getActaById);
router.get('/api/actas', actaController.getAllActas);
router.delete('/api/actas/:id', actaController.deleteActaById);

//tipos Actas controller.
router.post('/api/tipos-actas', tipoActaController.createTipoActa);
router.get('/api/tipos-actas', tipoActaController.getAllTiposActas);
router.put('/api/tipos-actas/:id', tipoActaController.updateTipoActa);
router.delete('/api/tipos-actas/:id', tipoActaController.deleteTipoActa);
router.get('/api/tipos-actas/:id', tipoActaController.getTipoActaById);

//inventario controller 
router.post('/api/inventario', inventario.crearOActualizarInventario);
router.get('/api/inventario', inventario.getAllInventarios);
router.get('/api/inventario/:id', inventario.getInventarioById);
router.put('/api/inventario/:id', inventario.cambiarEstadoInventario );
router.delete('/api/inventario/:id', inventario.deleteInventario);
router.get('/api/inventarioDescargar/:id', inventario.descargarInventario);

//materia prima
router.post('/api/inventario/materiaprima', inventarioMateriaPrima.crearOActualizarInventario);

//egresos
router.post('/api/egresos', upload2.single('archivoComprobatorio'), egresos.crearEgreso);
router.get('/api/egresos', egresos.getAllEgresos);
router.get('/api/egresos/:id', egresos.getEgresoById);
router.delete('/api/egresos/:id', egresos.deleteEgreso);




/////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/api/cotizaciones', cotizacion.crearCotizacion);
router.get('/api/cotizaciones', cotizacion.getAllCotizaciones);
router.get('/api/cotizaciones/:id', cotizacion.getCotizacionById);
router.delete('/api/cotizaciones/:id', cotizacion.deleteCotizacion);
router.get('/api/cotizaciones/:id/imprimir', cotizacion.imprimirCotizacion);
router.post('/api/cotizaciones/:id/reenviar', cotizacion.reenviarCotizacion);
router.put('/api/cotizaciones/:id', cotizacion.actualizarCotizacion);


//Pedidos

router.post('/api/pedidos', pedidos.crearPedido);
router.get('/api/pedidos', pedidos.getAllPedidos);
router.get('/api/pedidos/filtrar/:sucursalId/:fechaEntrega', pedidos.getPedidosPorSucursalYFecha);


router.use((req, res, next) => {
    res.status(404).render('404', {
        title: 'Página no encontrada',
        message: 'Lo sentimos, la página que buscas no existe.'
    });
});

module.exports = router

