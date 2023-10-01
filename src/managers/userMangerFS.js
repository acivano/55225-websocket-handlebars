const fs = require('fs/promises')
const path = require('path')

class UserManager{
    #users = []
    constructor(file){
        this.filepath = path.join(__dirname, '../data' ,file)
    
    }
    #readFile = async () => {
        const data = await fs.readFile(this.filepath, 'utf-8')
        this.#users = JSON.parse(data)
      }
    
    #writeFile = async() => {
    const data = JSON.stringify(this.#users, null, 2)
    await fs.writeFile(this.filepath, data)
    }
    async add(body){
        const {user,password,firstname,lastname,cart,role}=body
        await this.#readFile()
        const _id = this.#users.length  ? Math.max(...this.#users.map(prd => prd._id)) + 1 : 1
        this.#users.push({
            _id: _id.toString(),
            user,
            password,
            firstname,
            lastname,
            cart,
            role: role?role :'Custommer',
            createDate : Date.now()
        })
        await this.#writeFile()
        return await this.getById(_id)
    }
    async delete(id){
        await this.#readFile()

        this.#users = this.#users.filter(usr => usr.id != id)
        await this.#writeFile()

    }
    async getUsers(){
        return userModel.find().lean()
    }
    async getUserByUsername(user){
        await this.#readFile()
        // console.log(this.#users.find(usr => usr.user == user))
        return this.#users.find(usr => usr.user == user)
    }

    async getById(id){
        await this.#readFile()
        // console.log(this.#users.find(usr => usr._id == id))
        return this.#users.find(usr => usr._id == id)
    }
    async update(_id, entity) {

        // console.log('entra al update')
        await this.#readFile()
        let existing = await this.getById(_id)

        if(!existing){
            return 
        }
        this.#users = this.#users.filter(usr => usr._id.toString() != _id.toString())
        this.#users.push(entity)
        await this.#writeFile()
        return existing
    }



}

module.exports = new UserManager('users.json')
