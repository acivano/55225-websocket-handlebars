const passport = require('passport')
const local = require('passport-local')
const ManagerFactory = require('../managers/manager.factory')
const cartManager = ManagerFactory.getManagerInstance("carts")
const userManager = ManagerFactory.getManagerInstance("users")

const {hashPassword, isValidPassword}= require('../utils/password.utils')
const logger = require('../logger')

const LocalStrategy = local.Strategy

const signup = async (req , user , password, done) => {
    const usuBody = req.body
    const _user = {...usuBody, user : usuBody.user.toLowerCase()}


    try {
        const existing = await userManager.getUserByUsername(_user.user)

        if(existing){
            return done(null, false)
        }
        if(user.password==user.password2){
            delete user.password2
            const products = []
            const cart =  await cartManager.add({products})

            const newUser ={..._user, cart: cart._id, password: hashPassword(_user.password)}

            const createUsr = await userManager.add(newUser)

            const usu = {
                firstname: createUsr.firstname,
                lastname: createUsr.lastname,
                _id: createUsr._id,
                cart: createUsr.cart._id,
                ...createUsr._doc
              }

            return done(null, usu)

        }else{

            // return res.render('signup', {error: 'Las contraseñas no coinciden.'})
            logger.info('las contraseñas no coinciden')
            return done(null, false)
        }
    } catch (error) {
        // return res.render('signup', {error: 'Ha ocurrido un error. Vuelva a intentar.'})
        logger.error(`Ha ocurrido un error. Vuelva a intentar., ${error}`)
        return done(null, false)

    }
}
const login = async(user, password, done) => {    

    try {
    
        const existing = await userManager.getUserByUsername( user.toLowerCase())

        
        if(!existing){
            // return res.render('login', {error:'Usuario inexistente'})
            return done(null, false)
        }
        //user.password!=existing.password
        if(!isValidPassword(password, existing.password)){
            // return res.render('login', {error:'Contraseña incorrecta'})
            return done(null, false)
        }
        // const cartExisting = await cartManager.getCartByUser(existing._id)
        const _user = {
            firstname: existing.firstname,
            lastname: existing.lastname,
            role: existing.role,
            cart: existing.cart._id,
            ...existing
        }


        done(null, _user)
        // req.session.user = {
        //     firstname: existing.firstname,
        //     lastname: existing.lastname,
        //     id: existing._id,
        //     role: existing.role,
        //     cart: cartExisting._id,
        //     // role: 'Admin'
        //     ...user
        // }
        
        // req.session.save((err) => {
        //     if(!err) {
        //     res.redirect('/')
        //     }
        // })
    } catch (error) {
        // return res.render('login', {error: 'Ha ocurrido un error. Vuelva a intentar'})
        logger.error(`Ha ocurrido un error. Vuelva a intentar., ${error}`)
        return done(null, false)
    
    }
}




module.exports = {
    LocalStrategy,
    signup,
    login}