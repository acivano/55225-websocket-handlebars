const fs = require('fs/promises')
const path = require('path')

class chatManager{
    #messages = []
    constructor(file){
        this.filepath = path.join(__dirname, '../data' ,file)
    }
    #readFile = async () => {
        const data = await fs.readFile(this.filepath, 'utf-8')
        this.#messages = JSON.parse(data)
      }
    
    #writeFile = async() => {
    const data = JSON.stringify(this.#messages, null, 2)
    await fs.writeFile(this.filepath, data)
    }
    async addMessage(message){
        await this.#readFile()

        
        const _id = this.#messages.length  ? Math.max(...this.#messages.map(prd => prd._id)) + 1 : 1
        const fecha = new Date()
        this.#messages.push({_id ,user: message.user, text: message.message, datetime: fecha.toLocaleTimeString('en-US') })
        await this.#writeFile()
        return {user: message.user, text: message.message, datetime: fecha.toLocaleTimeString('en-US') }
        
    }
    async getMessages(){
        await this.#readFile()
        return this.#messages
    }

}

module.exports = new chatManager('messages.json')
