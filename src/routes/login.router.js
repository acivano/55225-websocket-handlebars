const { Router } = require('express')
const passport = require('passport')
const {isAuth, isAuthLogin, isAuthAdmin} = require('../middlewares/auth.middleware.js')

const ManagerFactory = require('../managers/manager.factory')
const cartManager = ManagerFactory.getManagerInstance("carts")
const userManager = require('../managers/user.manager.js')
const {hashPassword, isValidPassword} = require('../utils/password.utils.js')
const { GITHUB_STRATEGY_NAME } = require('../config/config.passwords.js')
const logger = require('../logger/index.js')
const { generateTokenPass, expitedToken } = require('../utils/generate.token.js')
const config = require('../config/config.js')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/config.jwt')



const router = Router()

const login = async(req, res, next) => {
  logger.debug('login login.router')
  const user = {user: req.body.user.toLowerCase(), password : req.body.password}   

  try {
    
        const existing = await userManager.getUserByUsername( user.user)

      
        if(!existing){
          return res.render('login', {error:'Usuario inexistente'})
        }
        //user.password!=existing.password
        if(!isValidPassword(user.password, existing.password)){
          return res.render('login', {error:'Contraseña incorrecta'})
        }

        req.session.user = {
          firstname: existing.firstname,
          lastname: existing.lastname,
          id: existing._id,
          role: existing.role,
          cart: existing.cart._id,
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
const signup =  async (req,res, next)=>{

  const usuBody = req.body
  const user = {...usuBody, user : usuBody.user.toLowerCase()}


  try {
      const existing = await userManager.getUserByUsername(user.user)

      if(existing){
          return res.render('signup', {error: 'EL usuario ya existe.'})
      }
      if(user.password==user.password2){
          delete user.password2
          const products = []
          const cart =  await cartManager.add({products})


          const newUser ={...user, cart: cart._id, password: hashPassword(user.password)}


          const createUsr = await userManager.add(newUser)
          req.session.user = {
            firstname: createUsr.firstname,
            lastname: createUsr.lastname,
            id: createUsr._id,
            cart: createUsr.cart._id,
            ...createUsr._doc
          }
        
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

const resetpassword = async (req,res, next)=>{
  
  const {user, password, password2} = req.body
  console.log({user, password, password2})


  try {
      const existing = await userManager.getUserByUsername(user)


      if(!existing){
          return res.render('resetpassword', {error: 'EL usuario no existe.'})
      }
      if(password==password2){

        console.log(existing.password, password)

         if(!isValidPassword(existing.password, password)){

          //  delete user.password2
 
           const newUser ={...existing, password: hashPassword(password)}
           console.log(newUser)
           const createUsr = await userManager.update(existing._id,newUser)
           console.log(createUsr)
  
           if(createUsr.modifiedCount >=1 ){
             res.redirect('/login')
           } else{
             return res.render('resetpassword', {user: existing.user, error: 'Ha ocurrido un error. Vuelva a intentar.'})
           }
         }


 
      }else{

          return res.render('resetpassword', {error: 'Las contraseñas no coinciden.'})
      }
  } catch (error) {
      return res.render('resetpassword', {user: user,error: 'Ha ocurrido un error. Vuelva a intentar.'})
  }
}

const githubCallBack =(req,res)=>{
  const last_connection = Date.now()
  let user = req.user 
  user = {...user, last_connection}
  console.log(user)

  req.session.user = {
    firstname: user.firstname,
    lastname: user.lastname,
    id: user._id,
    role: user.role,
    // cart: cartExisting._id,
    // role: 'Admin'
    ...user
  }
   
  const update = userManager.update(user._id, user)
  console.log('aca se debe actualizar el last-connection cuando viene por github')
  res.redirect('/')
}

router.get('/login', (req, res) => {
  logger.debug('render router')
    res.render('login')
})
router.get('/signup', isAuthLogin,(req, res) => {
    res.render('signup')
})
router.get('/profile', isAuth,(req, res) => {
  logger.debug(req.user)
    res.render('profile',{
        user: req.user ?  {
          ...req.user,
          isAdmin: req.user.role == 'Admin'? '1' : null,
          isPremium: req.user.role == 'Premium'? '1' : null
        } : null
    })
})
router.get('/logout', isAuth, (req, res) => {
    const firstname = req.user.firstname 
    console.log(req.user)

    const last_connection = Date.now()
    let user = req.user 
    user = {...user, last_connection}

    const update = userManager.update(user._id, user)

    console.log('aca se debe lograr el last-connection')

    req.logOut((err) =>{
      res.render('logout',{
        firstname
      })
    })
})
router.get('/resetpasswordUser', (req, res) => {

  res.render('resetpasswordUser')

})

router.get('/resetpwd/:token', (req, res) => {
  const token = req.params.token

  const credentials = jwt.verify(token, JWT_SECRET)
  console.log(credentials)
  // const expired = expitedToken(token)
  // console.log(expired)

  res.render('resetpassword',{
    user: credentials.user
  })

})

router.post('/resetpassword/:user',async(req, res) => {
  const user = req.params.user

  const token = await generateTokenPass(user)
  console.log(token)
  const credentials = jwt.verify(token, JWT_SECRET)
  console.log(credentials)


  const requestOptions = {
    method: 'POST',
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
    },

    body:JSON.stringify({
    to: "agustincivano@gmail.com",//hardcodeo por las dudas
    from: "no-reply@pruebascoderhoyse.com",
    subject: 'Actualización de contraseña',
    body: `<a href="http://${config.URL}:${config.PORT}/resetpwd/${token}">
              <button>Click me</button>
          </a>  `
    })
    }
    const response = await fetch(`http://${config.URL}:${config.PORT}/api/notification/mail`, requestOptions)
    res.send('ok')
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

router.post('/resetpwd/:token', resetpassword)


module.exports = router