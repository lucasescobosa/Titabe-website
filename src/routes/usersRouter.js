const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');

const {body} = require('express-validator');

var storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, path.join(__dirname,'/../../public/images/users'));
    },
    filename : (req, file, cb) => {
        cb(null, 'img-' + Date.now() + path.extname(file.originalname));
    }
})
var upload = multer ({storage:storage});

const usersController = require('../controllers/usersController');
//const usersMulterMiddleware = require('../middlewares/usersMulterMiddleware')
const guestMiddleware = require('../middlewares/guestMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const { appendFile } = require('fs');

//router.use(usersMulterMiddleware);

//Validaciones
const validationsRegister = [
    body('fullName').notEmpty().withMessage('Este campo no debe estar vacío.'),
    body('phoneNumber').notEmpty().withMessage('Este campo no debe estar vacío.'),
    body('address').notEmpty().withMessage('Este campo no debe estar vacío.'),
    body('email').notEmpty().withMessage('Este campo no debe estar vacío.'),
    body('password').notEmpty().withMessage('Este campo no debe estar vacío.'),
    body('passwordCheck').notEmpty().withMessage('Este campo no debe estar vacío.'), 
]

//Registro de nuevo usuario
router.get('/register', guestMiddleware, usersController.register);
router.post('/register', upload.single('image'), validationsRegister, usersController.store);

//Formulario de login
router.get('/login', guestMiddleware, usersController.login);  
router.post('/login', usersController.loginProcess);

//Proceso de Logout
router.get('/logout', usersController.logout);

module.exports = router;