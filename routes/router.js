const express = require('express')
const router = express.Router()

//authControler
const auth = require('../controllers/auth/auth')

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


router.get('/login', (req, res) => {    
    res.render('login');
});

router.get('/main', authenticated.isAuthenticated, (req, res) => {    
    res.render('main');
});

router.get('/usuarios', adminValidate.isAdmin, authenticated.isAuthenticated, (req, res) => {    
    res.render('Users/usuarios');
});
router.get('/franquicias', adminValidate.isAdmin, authenticated.isAuthenticated, (req, res) => {    
    res.render('Franquicias/franquicias');
});



//Auth
router.post('/api/auth/register', auth.registerUser)
router.post('/api/auth/login', auth.login)

router.get('/logout', logout.logout)
router.get('/api/isAdmin', adminVerify.isAdminVerify)

//MiddleWare
router.get('/api/verifySesion', verifySesion.verifyToken)


//funciones por usuario
router.post('/api/auth/functions/add', userFunctions.addFunction)
router.get('/api/auth/functions/:nameRol', userFunctions.getFunctionsByRole)
router.get('/api/functions', userFunctions.getAllFunctions)


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

module.exports = router