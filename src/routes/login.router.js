const { Router } = require('express')
const {isAuth, isAuthLogin, isAuthAdmin} = require('../dao/middlewares/auth.middleware.js')
const userManager = require('../dao/managers/user.manager.js')
const cartManager = require('../dao/managers/cart.manager.js')



const router = Router()

router.get('/login', isAuthLogin,(req, res) => {
    res.render('login')
  })

router.get('/signup', isAuthLogin,(req, res) => {
    res.render('signup')
})

router.get('/profile', isAuth,(req, res) => {
    res.render('profile',{
        user: req.user ?  {
          ...req.session.user,
          isAdmin: req.user.role == 'Admin'? '1' : null
        } : null
    })
})


router.get('/logout', isAuth, (req, res) => {
    const { user } = req.session
    console.log(user)

    // // borrar la cookie
    // res.clearCookie('user')

    req.session.destroy((err) => {
        if(err) {
        return res.redirect('/error')
        }

        res.render('logout', {
          firstname: user.firstname
        })

        req.user = null
    })
})

router.post('/login', async(req, res) => {
    // console.log(req.body)
    const user = {user: req.body.user.toLowerCase(), password : req.body.password}   
    console.log(user)

    try {
      
          const existing = await userManager.getUserByUsername( user.user)
          console.log(user)
          console.log(existing)
        
          if(!existing){
            return res.render('login', {error:'Usuario inexistente'})
          }
          if(user.password!=existing.password){
            return res.render('login', {error:'Contraseña incorrecta'})
          }
          const cartExisting = await cartManager.getCartByUser(existing._id)

          req.session.user = {
            firstname: existing.firstname,
            lastname: existing.lastname,
            id: existing._id,
            role: existing.role,
            cart: cartExisting._id,
            // role: 'Admin'
            ...user
          }
        
          req.session.save((err) => {
            if(!err) {
              res.redirect('/')
            }
          })
    } catch (error) {
      return res.render('login', {error: 'Ha ocurrido un error. Vuelva a intentar'})
      
    }
})
router.post('/signup', async (req,res)=>{
    console.log(req.body)
    const user = req.body

    try {
        const existing = await userManager.getUserByUsername(user.user)

        if(existing){
            return res.render('signup', {error: 'EL usuario ya existe.'})
        }
        if(user.password==user.password2){
            delete user.password2
            console.log(user)
            const createUsr = await userManager.addUser(user)

            const cart =  await cartManager.addCart(createUsr._id)
            console.log('newcart')

            console.log(cart)
            req.session.user = {
              firstname: createUsr.firstname,
              lastname: createUsr.lastname,
              id: createUsr._id,
              cart: cart._id,
              ...createUsr._doc
            }
          
            console.log(req.session)
            req.session.save((err) => {
              if(!err) {
                res.redirect('/')
              }
            })    
        }else{

            return res.render('signup', {error: 'La contraseñas no coinciden.'})
        }
    } catch (error) {
        return res.render('signup', {error: 'Ha ocurrido un error. Vuelva a intentar.'})
    }
})

module.exports = router