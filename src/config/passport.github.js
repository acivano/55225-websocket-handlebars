const GithubStrategy =  require('passport-github2')
const userManager= require('../dao/managers/user.manager')
const cartManager= require('../dao/managers/cart.manager')
const {GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_STRATEGY_NAME, PORT, HOST} = require('../config/config.passwords')

const GitHubAccessConfig ={
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET, 
    callBackURL: `http://${HOST}:${PORT}/githubSessions`
}

const gitHubUsers = async(profile, done)=>{
    console.log(profile)
    const {name, email} = profile._json

    const _user= await userManager.getUserByUsername(email)

    if(!_user){
        console.log('Usuario no encontrado')

        const cart =  await cartManager.addCart()
        console.log(cart)
        const newUser ={
            firstname: name.split(" ")[0],
            lastname: name.split(" ")[1],
            user: email,
            password:"",
            role: 'Custommer',
            cart: cart._id

        }

        const createUsr = await userManager.addUser(newUser)


        const usu = {
            firstname: createUsr.firstname,
            lastname: createUsr.lastname,
            _id: createUsr._id,
            cart: createUsr.cart._id,
            ...createUsr._doc
          }
          console.log('usu')

          console.log(usu)
        return done(null, usu)
    }

    console.log("el usuario ya existe")
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
    strategyName : GITHUB_STRATEGY_NAME

}