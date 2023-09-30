const { Router } = require('express')

const router = Router()

const {updateCartController, createTicketController, productsCartController, productCartController, 
      quantityProductsCartController, getCartController, deleteCartController, deleteProductCart} = require('../../controllers/carts.controller') 

//le actualizo el carrito al usuario
router.post('/:uid' , updateCartController)
//actualizo el carrito con productos
router.post('/:cid/products' , productsCartController)
router.post('/:cid/ticket' , createTicketController)
//actualizo el carrito con un producto
router.put('/:cid/product/:pid', productCartController)
//obtengo la cantidad de un producto del carrito
router.get('/:cid/:pid', quantityProductsCartController)
//recupero un carrito por su id
router.get('/:cid', getCartController)
//elimino un carrito
router.delete('/:id', deleteCartController)
//elimino un producto del carrito
router.delete('/:cid/product/:pid', deleteProductCart)


module.exports = router