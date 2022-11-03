const express = require('express');
const router = express.Router();

//Controller
const productsController = require('../controllers/productsController')

//Middlewares
const productsMulterMiddleware = require('../middlewares/productsMulterMiddleware');

//Listado de productos
router.get('/', productsController.index); 

//Detalle de producto
router.get('/detail/:id', productsController.detail);

//Formulario de creación de productos
router.get('/create', productsController.create);
router.post('/', productsMulterMiddleware.fields([{name: 'productImageMain', maxCount: 1} , {name: 'productImages' , maxCount: 3}]), productsController.store);

//Edicion de producto
router.get('/:id/edit', productsController.modify);
router.put('/:id', productsController.update);

//Borrado de producto
router.delete('/:id', productsController.delete);

//Carro de compras
router.get('/cart', productsController.cart);

module.exports = router;