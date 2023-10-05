const { Router } = require('express')
const ProductRouter = require('./api/products.router')
const CartRouter = require('./api/cart.router')
const UserRouter = require('./api/user.router')
const LoginRoutes = require('./login.router')

const HomeRoutes = require('./home.router')
const { jwtRoutes } = require('./api/auth.router')
const { jwtVerifyAuthToken } = require('../middlewares/jwt.auth.middleware')
const NotificationRoutes = require('./api/notifications.router')



const api = Router()

//agregar jwtVerifyAuthToken,
api.use('/products',jwtVerifyAuthToken, ProductRouter)
api.use('/user',jwtVerifyAuthToken, UserRouter)
api.use('/carts',jwtVerifyAuthToken, CartRouter)
api.use('/ticket',jwtVerifyAuthToken, CartRouter)

api.use('/notification', NotificationRoutes)


api.use('/jwtAuth', jwtRoutes)

const home = Router()

home.use('/', HomeRoutes)
home.use('/', LoginRoutes)


module.exports = {
    api, home
}