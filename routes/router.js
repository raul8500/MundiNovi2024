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
const multerProducts = require('../middlewares/multerProducts'); // Configuración de Multer




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
const  faltantes = require('../controllers/faltantes/faltantesController');
const  traspasos = require('../controllers/traspasos/traspasosController');

//
const tipoIngresoController = require('../controllers/ingresos/tipoIngresosController');
const ingresoController = require('../controllers/ingresos/ingresoController');
const colaboradorController = require('../controllers/colaboradores/colaboradoresController')
const contratoController = require('../controllers/colaboradores/contratosController')
const renunciaController = require('../controllers/colaboradores/renunciaController')


//test
const productoTest = require('../controllers/productos/productoController')
const clienteController = require('../controllers/clientes/clienteController')


//Zona clientes

const zonaClientes = require('../controllers/clientes/zonaClientes')

//Nuevas Ventas
const ventas = require('../controllers/venta/ventasController');



//Reportes:
const reportesCostoInventario = require('../controllers/reportes/costoInventario/costoInventarioController');


//indicadores
const indicadoresController = require('../controllers/cortes/indicadoresController');


//flujoEfectivo
const flujoEfectivoController = require('../controllers/flujoEfectivo/flujoEfectivoController');




//



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

router.get('/productos', authenticated.isAuthenticated,  verifyToken.verifyToken, (req, res) => {    
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





//Inico de traspaso
router.get('/reporteFaltantes', (req, res) => {    
    res.render('Faltantes/reporteFaltantes');
});

router.get('/traspasoProductos', (req, res) => {    
    res.render('Traspaso/traspasoProductos');
});

//Listado de traspasos para almacen e impresion de los codigos para los productos
router.get('/listadoTraspasos', (req, res) => {    
    res.render('Traspaso/listadoTraspasos');
});

router.get('/codigosTraspasos', (req, res) => {    
    res.render('Traspaso/codigosTraspasos');
});

//recepcion del reparto

router.get('/recepcionFaltantes', (req, res) => {    
    res.render('Traspaso/recepcionFaltantes');
});

router.get('/recepcionFaltantesProductos', (req, res) => {    
    res.render('Traspaso/recepcionFaltantesProductos');
});

//Recepcion de productos de las sucursales 
router.get('/recepcionFaltantesSucursal', (req, res) => {    
    res.render('Traspaso/recepcionFaltantesSucursal');
});


//Recepcion de productos de las sucursales 
router.get('/finalizarTraspaso', (req, res) => {    
    res.render('Traspaso/finalizarTraspaso');
});


router.get('/ingresos', (req, res) => {    
    res.render('Ingresos/Ingresos.ejs');
});


router.get('/reportesVentaProductos', (req, res) => {    
    res.render('Reportes/reportesVentaProductos');
});

router.get('/existenciasSucursales', (req, res) => {    
    res.render('Existencias/existenciasSucursales');
});

router.get('/colaboradores', (req, res) => {    
    res.render('Colaboradores/colaboradores');
});

router.get('/puntoVenta',authenticated.isAuthenticated, verifyToken.verifyToken, (req, res) => {    
    res.render('PuntoDeVenta/puntoVenta');
});



//

router.get('/nominas',authenticated.isAuthenticated, verifyToken.verifyToken, (req, res) => {    
    res.render('Nominas/listadoNomina');
});

router.get('/controlBancos',authenticated.isAuthenticated, verifyToken.verifyToken, (req, res) => {    
    res.render('Bancos/bancos');
});


router.get('/reporteCostoInventario',authenticated.isAuthenticated, verifyToken.verifyToken, (req, res) => {    
    res.render('Reportes/reporteCostoInventario');
});



//flujo de efectivo

router.get('/reporteFlujoEfectivo',authenticated.isAuthenticated, verifyToken.verifyToken, (req, res) => {    
    res.render('FlujoEfectivo/flujoEfectivo');
});












//Funciones al API
router.post('/api/auth/register', auth.registerUser)
router.post('/api/auth/login', auth.login)
//Auth
router.put('/api/auth/users/passwords/:id', auth.updatePassword)
router.get('/api/auth/users', auth.getAllUsers)
router.get('/api/auth/users/:id', auth.getUserById)
router.get('/api/auth/users/:id', auth.getUserById)
router.put('/api/auth/users/:id', auth.updateUserById)
router.delete('/api/auth/users/:id', auth.deleteUserById);
router.put('/api/auth/users/status/:id', auth.updateUserStatus)
router.get('/logout', logout.logout)
router.get('/api/auth/users/sucursales/:sucursalId1/:sucursalId2', auth.obtenerSucursalesYUsuarios)
router.get('/api/auth/users/sucursales/:sucursalId', auth.obtenerUsuariosPorSucursal)



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



//Clientes  (cambio de rutas)



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
router.post('/api/cortes/finalizar', cortesFinales.finalizarCorte)


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

router.get('/api/obtenerActividadesNoPorUsuario/:usuarioId', actividades.obtenerNumeroActividadesPorUsuario)






const multer2  = require('multer')
const upload = multer2({ dest: 'uploads/' })

//Capacitacion
router.post('/api/capacitaciones', upload.single('archivo'), capacitacionController.crearCapacitacion);
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
//router.post('/api/actualizar/:sucursalId', upload.single('file'), stocksController.actualizarStocks);


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
router.post('/api/egresos', upload.single('archivoComprobatorio'), egresos.crearEgreso);
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


//Faltantes

router.get('/api/faltantes/:sucursalOrigen/:sucursalDestino', faltantes.generarReporteFaltantes);


//traspasos
router.get('/api/traspasos/:sucursalOrigenId/:sucursalDestinoId/:fechaInicio/:fechaFinal', traspasos.obtenerVentasPorSucursalYFechas);
router.post('/api/traspasos', traspasos.realizarTraspaso);
router.get('/api/traspasos/fechas/:fechaInicio/:fechaFin', traspasos.obtenerTraspasosPorFechas);
router.get('/api/traspasos/:id', traspasos.obtenerTraspasoPorId);
router.post('/api/traspasos/:traspasoId', traspasos.generarPDFTraspaso);
router.get('/api/traspasos', traspasos.obtenerTodosLosTraspasos);

router.put('/api/traspasos/recibirReparto/:id', traspasos.recibirProductosBodega);

router.get('/api/traspasosSuc/:sucursalId', traspasos.obtenerTodosLosTraspasosSuc);


router.put('/api/traspasos/recibirReparto/:id', traspasos.recibirProductosBodega);
router.post('/api/traspasos/:id/recepcion-destino', traspasos.recibirProductosDestino);

router.post('/api/traspasos/:id/finalizar', traspasos.finalizarTraspaso);




//Nuevos

router.post('/api/tipos-ingreso', tipoIngresoController.crearTipoIngreso);
router.get('/api/tipos-ingreso', tipoIngresoController.obtenerTiposIngreso);
router.get('/api/tipos-ingreso/:id', tipoIngresoController.obtenerTipoIngresoPorId); // Nueva ruta
router.put('/api/tipos-ingreso/:id', tipoIngresoController.actualizarTipoIngreso);
router.delete('/api/tipos-ingreso/:id', tipoIngresoController.eliminarTipoIngreso);


router.post('/api/ingresos', ingresoController.crearIngreso);
router.get('/api/ingresos', ingresoController.obtenerIngresos);
router.get('/api/ingresos/:id', ingresoController.obtenerIngresoPorId);
router.put('/api/ingresos/:id', ingresoController.actualizarIngreso);
router.delete('/api/ingresos/:id', ingresoController.eliminarIngreso);


router.get('/api/venta/reporteVentasProductosSucursal/:sucursal/:fechaInicio/:fechaFin/:limite', venta.getReporteVentaProducto)


router.get('/api/existencia/productos/:id', productos.obtenerExistenciaPorProducto)


//Colaboradores  


router.post('/api/colaborador', colaboradorController.createColaborador);
router.get('/api/colaborador', colaboradorController.getAllColaboradoresFromBD);
router.get('/api/colaborador/:id', colaboradorController.getColaboradorByIdFromBD);
router.put('/api/colaborador/:id', colaboradorController.updateColaborador);
router.delete('/api/colaborador/:id', colaboradorController.deleteColaboradorFromBD);

//Contrato
router.get('/api/contrato', contratoController.obtenerContrato);
router.put('/api/contrato', contratoController.actualizarContrato);
router.get('/api/contrato/:idColaborador', contratoController.obtenerContratoConDatos);

//Renuncia
router.get("/api/renuncia/plantilla", renunciaController.obtenerPlantillaRenuncia);
router.post('/api/renuncia/', renunciaController.subirPlantillaRenuncia);
router.get("/api/renuncia/:idColaborador", renunciaController.obtenerRenunciaConDatos);




// Ruta
router.post('/api/producto/crear', multerProducts.single("imagen"), productoTest.createProduct);
router.get('/api/producto/test', productoTest.getAllProducts);
router.get('/api/producto/test/:id', productoTest.getProductById);
router.put('/api/producto/editar/:id', multerProducts.single("imagen"), productoTest.updateProduct);
router.delete('/api/producto/eliminar/:id', productoTest.deleteProduct);


//clientes
router.post('/api/cliente/test', clienteController.createClient);
router.get('/api/cliente/test', clienteController.getClients);
router.get('/api/cliente/test/:id', clienteController.getClientById);
router.delete('/api/cliente/delete/:id', clienteController.deleteClient);
router.put('/api/cliente/test/:id', clienteController.updateClient);

//Zona clientes
// Configuración de rutas
router.post('/api/zonaclientes', zonaClientes.createZonaCliente);
router.get('/api/zonaclientes', zonaClientes.getZonasClientes);
router.get('/api/zonaclientes/:id', zonaClientes.getZonaClienteById);
router.put('/api/zonaclientes/:id', zonaClientes.updateZonaCliente);
router.delete('/api/zonaclientes/:id', zonaClientes.deleteZonaCliente);




//Mensajes: 
router.post('/send-message', venta.sendTextMessage );

//Venta
router.post('/api/venta/crear', ventas.createVenta);


//Cargar desde excel
const path = require('path');
const multer3 = require('multer');

const storage = multer3.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // crea esta carpeta si no existe
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});


const upload3 = multer3({ storage });



router.post('/api/load-products/excel', upload3.single('file'), productoTest.loadProductsFromExcel);





//Reportes: 
router.get('/api/reporteCostoInventario/:sucursal', reportesCostoInventario.getAllKardex);



//Indicadores

// Ruta para obtener todos los indicadores
router.get('/api/indicadores', indicadoresController.getIndicadores);

// Ruta para obtener un indicador por ID
router.get('/api/indicadores/:sucursalId', indicadoresController.getIndicadorById);

// Ruta para crear un nuevo indicador
router.post('/api/indicadores', indicadoresController.createIndicador);

// Ruta para actualizar un indicador por ID
router.put('/api/indicadores/:id', indicadoresController.updateIndicador);

// Ruta para eliminar un indicador por ID
router.delete('/api/indicadores/:id', indicadoresController.deleteIndicador);

router.post('/api/indicadores/update', indicadoresController.updateOrCreateIndicador);



//flujoEfectivo
router.get('/api/flujoEfectivo', flujoEfectivoController.getAllFlujos);



router.use((req, res, next) => {
    res.status(404).render('404', {
        title: 'Página no encontrada',
        message: 'Lo sentimos, la página que buscas no existe.'
    });
});

module.exports = router

