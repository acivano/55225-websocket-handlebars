const { Router } = require('express')
const passport = require('passport')
const {isAuth, isAuthLogin, isAuthAdmin} = require('../dao/middlewares/auth.middleware.js')
const userManager = require('../dao/managers/user.manager.js')
const cartManager = require('../dao/managers/cart.manager.js')
const {hashPassword, isValidPassword} = require('../utils/password.utils.js')
const { GITHUB_STRATEGY_NAME } = require('../config/config.passwords.js')

const router = Router()

const login = async(req, res) => {
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
        //user.password!=existing.password
        if(!isValidPassword(user.password, existing.password)){
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
}
const signup =  async (req,res)=>{

  const usuBody = req.body
  const user = {...usuBody, user : usuBody.user.toLowerCase()}


  try {
      const existing = await userManager.getUserByUsername(user.user)

      if(existing){
          return res.render('signup', {error: 'EL usuario ya existe.'})
      }
      if(user.password==user.password2){
          delete user.password2

          const newUser ={...user, password: hashPassword(user.password)}
          console.log(user)
          console.log(newUser)

          const createUsr = await userManager.addUser(newUser)

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

          return res.render('signup', {error: 'Las contraseñas no coinciden.'})
      }
  } catch (error) {
      return res.render('signup', {error: 'Ha ocurrido un error. Vuelva a intentar.'})
  }
}
const resetpassword = async (req,res)=>{
  console.log(req.body)
  const user = req.body

  try {
      const existing = await userManager.getUserByUsername(user.user)
      console.log('resetpassword existing')
      console.log(existing)

      if(!existing){
          return res.render('resetpassword', {error: 'EL usuario no existe.'})
      }
      if(user.password==user.password2){
          delete user.password2

          const newUser ={...existing, password: hashPassword(user.password)}
          console.log(user)
          console.log(newUser)

          const createUsr = await userManager.updateUser(existing._id,newUser)
          console.log('createUsr')

          console.log(createUsr)

          if(createUsr.modifiedCount >=1 ){
            res.redirect('/login')
          } else{
            return res.render('resetpassword', {error: 'Ha ocurrido un error. Vuelva a intentar.'})
          }

 
      }else{

          return res.render('resetpassword', {error: 'Las contraseñas no coinciden.'})
      }
  } catch (error) {
      return res.render('resetpassword', {error: 'Ha ocurrido un error. Vuelva a intentar.'})
  }
}
const githubCallBack =(req,res)=>{
  const user = req.user

  req.session.user = {
    firstname: user.firstname,
    lastname: user.lastname,
    id: user._id,
    role: user.role,
    // cart: cartExisting._id,
    // role: 'Admin'
    ...user
  }
  res.redirect('/')
}

router.get('/login', isAuthLogin,(req, res) => {
    res.render('login')
})
router.get('/signup', isAuthLogin,(req, res) => {
    res.render('signup')
})
router.get('/profile', isAuth,(req, res) => {
    res.render('profile',{
        user: req.user ?  {
          ...req.user,
          isAdmin: req.user.role == 'Admin'? '1' : null
        } : null
    })
})
router.get('/logout', isAuth, (req, res) => {
    const firstname = req.user.firstname
    console.log('user LogOut')

    console.log(firstname)
    req.logOut((err) =>{
      res.render('logout',{
        firstname
      })
    })
})
router.get('/resetpassword', isAuthLogin,(req, res) => {
  res.render('resetpassword')
})
//LOGIN GITHUB
router.get('/github', passport.authenticate(GITHUB_STRATEGY_NAME), (_,res) => {})

router.get('/githubSessions', passport.authenticate(GITHUB_STRATEGY_NAME), githubCallBack)


router.post('/login',  passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login'
}))
router.post('/signup', passport.authenticate('local-signup',{
  successRedirect:'/profile',
  failureRedirect:'/signup'
}))

router.post('/resetpassword', resetpassword)


module.exports = router