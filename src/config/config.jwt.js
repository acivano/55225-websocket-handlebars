const JWT_SECRET = 'coderhouse'
const JWT_PAYLOAD= {
    expiresIn: '24h'
}
const JWT_PAYLOAD_PASS= {
    expiresIn: '1h'
}

module.exports = {
    JWT_PAYLOAD,
    JWT_SECRET,
    JWT_PAYLOAD_PASS
}

