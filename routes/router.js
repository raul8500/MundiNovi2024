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

module.exports = router