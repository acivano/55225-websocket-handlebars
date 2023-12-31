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
        if(_user.password==_user.password2){
            delete _user.password2
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

            logger.info('las contraseñas no coinciden')
            return done(null, false)
        }
    } catch (error) {
        logger.error(`Ha ocurrido un error. Vuelva a intentar., ${error}`)
        return done(null, false)

    }
}
const login = async(usr, password, done) => {    

    try {
    
        const existing = await userManager.getUserByUsername( usr.toLowerCase())

        
        if(!existing){
            return done(null, false)
        }
        if(!isValidPassword(password, existing.password)){
            return done(null, false)
        }
        const _user = {
            firstname: existing.firstname,
            lastname: existing.lastname,
            role: existing.role,
            cart: existing.cart._id,
            ...existing
        }
        const last_connection = Date.now()
        let user = existing
        user = {...user, last_connection}
        const update = userManager.update(user._id, user)

        done(null, _user)

    } catch (error) {
        logger.error(`Ha ocurrido un error. Vuelva a intentar., ${error}`)
        return done(null, false)
    
    }
}




module.exports = {
    LocalStrategy,
    signup,
    login}