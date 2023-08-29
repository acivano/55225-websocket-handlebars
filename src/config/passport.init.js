const passport = require('passport')
const userManager= require('../dao/managers/user.manager')
const cartManager= require('../dao/managers/cart.manager')

const {LocalStrategy, signup, login} = require("./passport.local.config")
const {GithubStrategy, GitHubAccessConfig, profileGitHubController, strategyName} = require('../config/passport.github')


const init =()=>{

    passport.use('local-signup', new LocalStrategy({usernameField:'user', passReqToCallback:true}, signup))
    passport.use('local-login', new LocalStrategy({usernameField:'user'}, login))

    passport.use(strategyName, new GithubStrategy(GitHubAccessConfig, profileGitHubController))

    passport.serializeUser((user, done)=>{
        done(null, user._id)
    })
    passport.deserializeUser(async(_id, done)=>{
        const user = await userManager.getUserById(_id)
        console.log('userDeserialize')
                const cartExisting = await cartManager.getCartByUser(_id)
        const _user = {            
            ...user,
            cart: cartExisting._id
        }

        console.log(_user)
        done(null, _user)
    })
}

module.exports = init