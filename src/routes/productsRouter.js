const express = require('express');
const router = express.Router();

//Controller
const productsController = require('../controllers/productsController')

//Middlewares
const productsMulterMiddleware = require('../middlewares/productsMulterMiddleware');

//Listado de productos
router.get('/', productsController.index); 

//Formulario de creación de productos
router.get('/create', productsController.create);
router.post('/', productsMulterMiddleware.single('productImage'), productsController.store);

//Detalle de producto
router.get('/detail/:id', productsController.detail);

//Edicion de producto
router.get('/:id/edit', productsController.modify);
router.put('/:id', productsController.update);

//Borrado de producto
router.delete('/:id', productsController.delete);

//Carro de compras
router.get('/cart', productsController.cart);

module.exports = router;