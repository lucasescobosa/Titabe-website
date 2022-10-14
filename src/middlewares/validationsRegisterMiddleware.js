const {body} = require('express-validator');

//Validaciones
const validationsRegister = [
    body('fullName').notEmpty().withMessage('Este campo no debe estar vacío.'),
    body('phoneNumber').notEmpty().withMessage('Este campo no debe estar vacío.'),
    body('address').notEmpty().withMessage('Este campo no debe estar vacío.'),
    body('email').notEmpty().withMessage('Este campo no debe estar vacío.'),
    body('password').notEmpty().withMessage('Este campo no debe estar vacío.'),
    body('passwordCheck').notEmpty().withMessage('Este campo no debe estar vacío.'), 
]

module.exports = validationsRegister;