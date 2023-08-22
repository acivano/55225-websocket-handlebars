const { Router } = require('express')
const ProductRouter = require('./api/products.router')
const CartRouter = require('./api/cart.router')
const UserRouter = require('./api/user.router')
const LoginRoutes = require('./login.router')

const HomeRoutes = require('./home.router')


const api = Router()

api.use('/products', ProductRouter)
api.use('/user', UserRouter)

api.use('/carts', CartRouter)

const home = Router()

home.use('/', HomeRoutes)
home.use('/', LoginRoutes)


module.exports = {
    api, home
}