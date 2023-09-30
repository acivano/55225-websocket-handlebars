const {Router} = require('express')
const router = Router()
const { getProductByIdController, getProductController, newProductController, updateProductController,deleteProductController }= require('../../controllers/products.controller')

router.get('/', getProductController)
router.get('/:pid', getProductByIdController)
router.post('/', newProductController)    

router.put('/:id', updateProductController)

router.delete('/:id', deleteProductController)

module.exports = router