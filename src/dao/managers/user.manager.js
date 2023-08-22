const fs = require('fs/promises')

const userModel = require('../models/user.model')

class UserManager{
    //ok
    async addUser(user){

        return await userModel.create(user)
        
    }
    //ok
    async getUsers(){
        return userModel.find().lean()
    }
    async getUserByUsername(user){
        return userModel.findOne({user}).lean()
    }

    async getUserById(id){
        const user = userModel.findOne({_id: id}).lean()
        console.log( user)
        return user
    }

}

module.exports = new UserManager()
