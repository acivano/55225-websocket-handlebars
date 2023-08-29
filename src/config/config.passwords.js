const HOST = 'localhost'
const PORT = 8081

const MONGO_USER="agustincivano"
const MONGO_PASS="CyIyEfz39CK8k6Je"
const MONGO_DB = "ecommerce"
const MONGO_URL = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.hcav26p.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`

// mongoUrl: 'mongodb+srv://agustincivano:CyIyEfz39CK8k6Je@cluster0.hcav26p.mongodb.net/ecommerce?retryWrites=true&w=majority',

const GITHUB_CLIENT_ID = 'Iv1.4b3977f74de0e32c'
const GITHUB_CLIENT_SECRET = '0f2d9ad1d5072e0662f3f509e2063166a6e13c1e'
const GITHUB_STRATEGY_NAME = "github"

module.exports = {
    HOST,
    PORT,
    MONGO_URL,
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    GITHUB_STRATEGY_NAME
}