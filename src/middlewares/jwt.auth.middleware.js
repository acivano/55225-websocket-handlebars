const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/config.jwt')

const jwtVerifyAuthToken = (req, res, next) =>{
    const authHeader = req.headers.authorization

    if(!authHeader){
        res.status(401).send({
            status: 'Error',
            error:'not authenticated'
        })
        return
    }
    const token = authHeader.replace('Bearer ', '')

    try {
        const credentials =jwt.verify(token, JWT_SECRET)
        req.user = credentials

        next()
    } catch (error) {
        res.status(400).send({
            status: 'Error',
            error: 'not valid token'
        })
        res.end()
        
    }
}

module.exports = {
    jwtVerifyAuthToken
}