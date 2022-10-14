const multer = require('multer');
const path = require('path');

//Declaración de variables de Multer para subir imagenes
var storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, path.join(__dirname,'/../../public/images/products'));
    },
    filename : (req, file, cb) => {
        cb(null, 'img-' + Date.now() + path.extname(file.originalname));
    }
})
var upload = multer ({storage:storage});

module.exports = upload;