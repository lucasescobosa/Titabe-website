const { json } = require('express');
const db = require('../database/models');
const Product = require('../database/models/Product');

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const productsController = {
	//Todos los productos
    index: async (req, res) => {
		try{
			const products = await db.Product.findAll({
				//Incluir la tabla imagenes y obtener la principal
				include: {
							association: 'products_images',
							where: { main: 1 }
						},
				//Ordenar para que aparezcan primero las ofertas y al último los productos sin stock
				order: [
					['offer', 'DESC'],  
					['stock', 'DESC']
				]
			})
			console.log(JSON.stringify(products,null,2))
			if(!products) {
				res.status(404).json({error: 'No encontrado'});
				return
			};

			res.render('./products/products', {products, toThousand})

		} catch(e) {
      		res.status(500).json({ error: e })
		}     
    },

	//Creat un producto
    create: (req, res) => {
        res.render('./products/productCreate') //crear nueva vista para creacion
    },

	//Formulario de creacion de un producto
    store: async (req, res) => {
        try {
			const product = await db.Product.create({
				name : req.body.productName,
				descriptionShort : req.body.productDescriptionShort,
				descriptionLong : req.body.productDescriptionLong,
				price : parseInt(req.body.productPrice),
				subcategory_id : 1
				//category : req.body.productCategory,
				//image : req.file ? req.file.filename : 'default-image.png'
			});

			res.redirect('/products')
		} catch(e) {
			res.status(500).json({ error: e })
		}
	},

	//Detalle de un producto
    detail: async (req, res) => {
		try {
			const product = await db.Product.findByPk(req.params.id , {
				include: {
					association: 'products_images'
				}
			})
			res.render('./products/productDetail', {product, toThousand});
		} catch(e) {
			res.status(500).json({ error: e })
		}		
    },

	//Modificar un producto
    modify: (req, res) => {
        let product = products.find(element => element.id == req.params.id)
		res.render('./products/productModify', {product:product, toThousand});
    },
	//Formulario de modificacion de producto
    update: (req, res) => {
        let index = products.indexOf(products.find(element => element.id == req.params.id));
		products[index]={
			id : products[index].id,
			name : req.body.productName,
			descriptionShort : req.body.productDescriptionShort,
			descriptionLong : req.body.productDescriptionLong,
			price : parseInt(req.body.productPrice),
			category : req.body.productCategory,
			image : products[index].image
		}
		fs.writeFileSync(productsFilePath, JSON.stringify(products, null, ' '));
		res.redirect('/products/');
    },

	//Formulario de eliminacion de un producto
    delete: (req, res) => {
        let index = products.indexOf(products.find(element => element.id == req.params.id));
		products.splice(index, 1);
		fs.writeFileSync(productsFilePath, JSON.stringify(products, null, ' '));
		res.redirect('/products/');
    },

	//Carrito de compras
    cart: (req, res) => {
        res.render('./products/productCart')
    },
    
    
}

module.exports = productsController;