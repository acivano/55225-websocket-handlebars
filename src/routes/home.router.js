const { Router } = require('express')
const productManager = require('../dao/managers/product.manager.js')
const cartManager = require('../dao/managers/cart.manager.js')

const userManager = require('../dao/managers/user.manager.js')
const {isAuth, isAuthLogin, isAuthAdmin} = require('../dao/middlewares/auth.middleware.js')


const router = Router()


router.get('/', async (req, res) => {
  // res.sendFile(path.join(__dirname, '../public/index.html'))
  // const randomId = getRandomNumber(0, products.length - 1)

  res.render('home', {
    user: req.user ?  {
      ...req.user,
      isAdmin: req.user.role == 'Admin'? '1' : null
    } : null
  })
})

router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts')
})

//agregar middleware isAuth
router.get('/cart/:id', isAuth, async (req, res) => {
  const id = req.params.id
  console.log(id)
  res.render('cart',{id,
    user: req.user ?  {
      ...req.user,
      isAdmin: req.user.role == 'Admin'? '1' : null
    } : null})
})
router.get('/addProduct', isAuth, isAuthAdmin,(req, res) => {
  res.render('formProduct',{
    user: req.user ?  {
      ...req.user,
      isAdmin: req.user.role == 'Admin'? '1' : null
    } : null
  })
})
router.get('/chat', isAuth,(req, res) => {
  res.render('chat',{
    user: req.user ?  {
      ...req.user,
      isAdmin: req.user.role == 'Admin'? '1' : null
    } : null})
})

module.exports = router