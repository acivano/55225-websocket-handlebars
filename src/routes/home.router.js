const { Router } = require('express')
const path = require('path')
const ProductManager = require('../managers/ProductManager')
const productManager = new ProductManager('productos.json')

const router = Router()

// function getRandomNumber(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

router.get('/', async (req, res) => {
  // res.sendFile(path.join(__dirname, '../public/index.html'))
  const products = await productManager.getProducts()
  // const randomId = getRandomNumber(0, products.length - 1)

  res.render('home', {
    products: products
  })
})

router.get('/realtimeproducts', (req, res) => {
  // res.sendFile(path.join(__dirname, '../public/carrito.html'))
  res.render('realTimeProducts')
})
router.get('/addProduct', (req, res) => {
  // res.sendFile(path.join(__dirname, '../public/carrito.html'))
  res.render('formProduct')
})

module.exports = router