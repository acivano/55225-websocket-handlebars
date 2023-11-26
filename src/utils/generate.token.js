const jwt = require('jsonwebtoken')
const { isJwtExpired } = require('jwt-check-expiration')

const { JWT_PAYLOAD, JWT_SECRET, JWT_PAYLOAD_PASS } = require('../config/config.jwt')

const generateToken = user => jwt.sign(
    {user}, JWT_SECRET,JWT_PAYLOAD 
)

const generateTokenPass = user => jwt.sign(
    {user}, JWT_SECRET,JWT_PAYLOAD_PASS 
)

const expitedToken = (token) =>{

    //console.log('isExpired is:', isJwtExpired(token))
    return isJwtExpired(token)
}

module.exports = {
    generateToken,
    generateTokenPass,
    expitedToken
}