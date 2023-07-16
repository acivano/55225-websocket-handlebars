const { Router } = require('express')
const ProductRouter = require('./api/products.router')
const CartRouter = require('./api/cart.router')
const HomeRoutes = require('./home.router')


const api = Router()

api.use('/products', ProductRouter)
api.use('/carts', CartRouter)

const home = Router()

home.use('/', HomeRoutes)

module.exports = {
    api, home
}