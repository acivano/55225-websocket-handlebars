const { Router } = require('express')
const {homerViewController, realTimeProductsViewController, cartViewController, addProductViewController, chatViewController, usersViewController} = require('../controllers/home.controller')
const {isAuth, isAuthLogin, isAuthAdmin, isAuthNotAdmin, isAuthAdmiOrPremium} = require('../middlewares/auth.middleware.js')
const { generateUsersRecord } = require('./api/products.seed')
const { now } = require('mongoose')
const router = Router()
const logger = require('../logger/index')



router.get('/', homerViewController)
router.get('/realtimeproducts', realTimeProductsViewController)
router.get('/cart/:id', isAuth, isAuthNotAdmin, cartViewController)
router.get('/addProduct', isAuth, isAuthAdmiOrPremium, addProductViewController)
router.get('/users', isAuth, isAuthAdmin, usersViewController)

router.get('/chat', isAuth, isAuthNotAdmin,chatViewController)

router.get('/mockingproducts', async(req,res, next)=>{

        try {
                const productos = await generateUsersRecord()
                res.send(productos)
        } catch (error) {
                console.log(error)  
        }

})

router.get('/loggerTest', async(_req,res)=>{

        logger.debug(`Este es un mensaje de debug. -${new Date()}`)
        logger.info(`Este es un mensaje de información. -${new Date()}`)
        logger.warn(`Este es un mensaje de warn. -${new Date()}`)
        logger.error(`Este es un mensaje de error. -${new Date()}`)
        res.send({Mensaje: `Revisar error.log y la consola -${new Date()}`})
})

module.exports = router