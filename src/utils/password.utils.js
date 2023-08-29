const bcrypt = require('bcrypt')

const hashPassword = (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

const isValidPassword = (pass1, pass2)=>{
    return bcrypt.compareSync(pass1,pass2)
}

module.exports ={hashPassword, isValidPassword}