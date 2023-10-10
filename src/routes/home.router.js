const { Router } = require('express')
const {homerViewController, realTimeProductsViewController, cartViewController, addProductViewController, chatViewController} = require('../controllers/home.controller')
const {isAuth, isAuthLogin, isAuthAdmin, isAuthNotAdmin} = require('../middlewares/auth.middleware.js')
const { generateUsersRecord } = require('./api/products.seed')
const router = Router()


router.get('/', homerViewController)
router.get('/realtimeproducts', realTimeProductsViewController)
//agregar middleware isAuth
router.get('/cart/:id', isAuth, isAuthNotAdmin, cartViewController)
router.get('/addProduct', isAuth, isAuthAdmin,addProductViewController)

router.get('/chat', isAuth, isAuthNotAdmin,chatViewController)

router.get('/mockingproducts', async(req,res, next)=>{

        try {
                const productos = await genearateUsersRecord()
                res.send(productos)
        } catch (error) {
                
                next(new CustomError(ErrorType.General))
        }
           


})


module.exports = router