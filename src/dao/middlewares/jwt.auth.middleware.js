const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../../config/config.jwt')

const jwtVerifyAuthToken = (req, res, next) =>{
    console.log(req.headers)
    const authHeader = req.headers.authorization
    console.log(authHeader)

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
        console.log(credentials)

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