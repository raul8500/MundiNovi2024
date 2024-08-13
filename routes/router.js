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

router.get('/login', (req, res) => {    
    res.render('login', { user: req.user });
});

router.get('/main', (req, res) => {    
    res.render('main', { user: req.user });
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


module.exports = router