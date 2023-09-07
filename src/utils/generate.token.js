const jwt = require('jsonwebtoken')
const { JWT_PAYLOAD, JWT_SECRET } = require('../config/config.jwt')

const generateToken = user => jwt.sign(
    {user}, JWT_SECRET,JWT_PAYLOAD 
)

module.exports = {
    generateToken
}