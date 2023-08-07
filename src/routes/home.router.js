const { Router } = require('express')

const productManager = require('../dao/managers/product.manager.js')

const router = Router()


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
router.get('/chat', (req, res) => {
  res.render('chat')
})

module.exports = router