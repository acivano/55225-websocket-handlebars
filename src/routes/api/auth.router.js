const {Router}= require('express')
const router = Router()
const { isValidPassword } = require('../../utils/password.utils')
const passport = require('passport')
const { generateToken } = require('../../utils/generate.token')
const e = require('express')
const userManager = require('../../managers/user.manager')


router.post('/login', async (req, res) => {
    const {user, password} = req.body
    
    try {

        const userDB = await userManager.getUserByUsername(user) 

        
        if(!userDB || !isValidPassword(password, userDB?.password)){
            return res.send({
                status:'fail',
                error:'Contraseña incorrecta'
            })
        }
        delete userDB.password

        const token = generateToken(userDB)
        return res.send({
            status: 'success',
            message: token
        })
        
    } catch (error) {
        res.send({
            status: 'fail',
            error: error
        })
    }
})

module.exports ={
    jwtRoutes: router
}