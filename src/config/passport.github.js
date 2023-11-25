const GithubStrategy =  require('passport-github2')
const ManagerFactory = require('../managers/manager.factory')
const cartManager = ManagerFactory.getManagerInstance("carts")

const userManager= require('../managers/user.manager')


const config = require('../config/config')


const GitHubAccessConfig ={
    clientID: config.GITHUB_CLIENT_ID,
    clientSecret: config.GITHUB_CLIENT_SECRET, 
    callBackURL: `https://55225-agustincivano-production.up.railway.app/githubSessions`
}
// callBackURL: `http://${config.URL}:${config.PORT}/githubSessions`


const gitHubUsers = async(profile, done)=>{
    const {name, email} = profile._json

    const _user= await userManager.getUserByUsername(email)

    if(!_user){
        const products = []
        const cart =  await cartManager.add({products})
        const newUser ={
            firstname: name.split(" ")[0],
            lastname: name.split(" ")[1],
            user: email,
            password:"",
            role: 'Custommer',
            cart: cart._id

        }

        const createUsr = await userManager.add(newUser)


        const usu = {
            firstname: createUsr.firstname,
            lastname: createUsr.lastname,
            _id: createUsr._id,
            cart: createUsr.cart._id,
            ...createUsr._doc
          }

        return done(null, usu)
    }

    return done(null, _user)
}

const  profileGitHubController = async( accessToken, refreshToken, profile, done)=>{
    try {
        return await gitHubUsers(profile, done)        
    } catch (error) {
        done(error)
    }
}

module.exports = {
    GithubStrategy,
    GitHubAccessConfig,
    profileGitHubController,
    strategyName : config.GITHUB_STRATEGY_NAME

}