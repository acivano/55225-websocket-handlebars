const { Router } = require('express')

const router = Router()

const {updateCartController, createTicketController, productsCartController, productCartController, 
      quantityProductsCartController, getCartController, deleteCartController, deleteProductCart} = require('../../controllers/carts.controller') 

router.get('/:cid', getCartController)
router.post('/:uid' , updateCartController)


router.post('/:cid/products' , productsCartController)

router.post('/:cid/ticket' , createTicketController)

router.put('/:cid/product/:pid', productCartController)

router.get('/:cid/product:pid', quantityProductsCartController)

router.delete('/:id', deleteCartController)

router.delete('/:cid/product/:pid', deleteProductCart)


module.exports = router