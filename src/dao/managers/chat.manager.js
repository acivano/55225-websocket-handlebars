const fs = require('fs/promises')

const chatModel = require('../models/chat.model')

class ChatManager{
    //ok
    async addMessage(message){
        const fecha = new Date()
        const messageNew = {user: message.user, text: message.message, datetime: fecha.toLocaleTimeString('en-US') }
        console.log(messageNew)
        return await chatModel.create(messageNew)
        
    }
    //ok
    async getMessages(){
        return chatModel.find().lean()
    }

}

module.exports = new ChatManager()
