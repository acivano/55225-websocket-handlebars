const { Router } = require('express')
const ProductRouter = require('./api/products.router')
const CartRouter = require('./api/cart.router')
const UserRouter = require('./api/user.router')
const LoginRoutes = require('./login.router')

const HomeRoutes = require('./home.router')
const { jwtRoutes } = require('./api/auth.router')
const { jwtVerifyAuthToken } = require('../dao/middlewares/jwt.auth.middleware')


const api = Router()

api.use('/products', ProductRouter)
api.use('/user', jwtVerifyAuthToken,UserRouter)
//agregar jwtVerifyAuthToken
api.use('/carts', CartRouter)

api.use('/jwtAuth', jwtRoutes)

const home = Router()

home.use('/', HomeRoutes)
home.use('/', LoginRoutes)


module.exports = {
    api, home
}