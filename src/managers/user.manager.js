
const userModel = require('../models/user.model')
const BaseManager = require('./base.manager')

class UserManager extends BaseManager{
    constructor(){
        super(userModel)
    }

    async getUsers(){
        return userModel.find().lean()
    }
    async getUserByUsername(user){
        return userModel.findOne({user}).lean()
    }

    async getUserById(id){
        const user = userModel.findOne({_id: id}).lean()
        return user
    }
    async update(id, entity) {
        const result = await userModel.updateOne({ _id: id }, entity)
    
        return result
      }

    async updateUser(id, usu){
        const result = userModel.updateOne({_id: id}, usu)


        return result
    }

}

module.exports = new UserManager()
