const { Router } = require('express')
const {homerViewController, realTimeProductsViewController, cartViewController, addProductViewController, chatViewController} = require('../controllers/home.controller')
const {isAuth, isAuthLogin, isAuthAdmin, isAuthNotAdmin} = require('../middlewares/auth.middleware.js')
const router = Router()

router.get('/', homerViewController)
router.get('/realtimeproducts', realTimeProductsViewController)
//agregar middleware isAuth
router.get('/cart/:id', isAuth, isAuthNotAdmin, cartViewController)
router.get('/addProduct', isAuth, isAuthAdmin,addProductViewController)

router.get('/chat', isAuth, isAuthNotAdmin,chatViewController)

module.exports = router