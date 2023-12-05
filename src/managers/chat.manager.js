const chatModel = require('../models/chat.model')

class chatManager{
    async addMessage(message){
        const fecha = new Date()
        const messageNew = {user: message.user, text: message.message, datetime: fecha.toLocaleTimeString('en-US') }
        return await chatModel.create(messageNew)
        
    }
    async getMessages(){
        const messages = await chatModel.find().lean()
        return messages
    }

}

module.exports = new chatManager()
