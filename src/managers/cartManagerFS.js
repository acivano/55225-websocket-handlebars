const fs = require('fs/promises')
const path = require('path')
const productManager = require('./productManagerFS')


class cartManager {
    #carts = []
    constructor(file){
        this.filepath = path.join(__dirname, '../data' ,file)
    }
    #readFile = async () => {
        const data = await fs.readFile(this.filepath, 'utf-8')
        this.#carts = JSON.parse(data)
      }
    
    #writeFile = async() => {
    const data = JSON.stringify(this.#carts, null, 2)
    await fs.writeFile(this.filepath, data)
    }
    async update(id, products){
        // console.log(products)
        await this.#readFile()
        const cart = await this.getById(id)
        // console.log(cart)
        cart.products= products.products
        // console.log(cart)

        this.#carts = this.#carts.filter(cart => cart._id != id)
        this.#carts.push(cart)
        await this.#writeFile()
        return this.getById(id)
    }
    async getById(id){
        await this.#readFile()

        return this.#carts.find(cart => cart._id == id)
    }
    async deleteProductInCart(id, pid){
        await this.#readFile()
        const cart = this.#carts.find(cart => cart._id == id)
        const prod = await productManager.getById(pid)
        // console.log(prod)


        if(!cart || !prod){
            return
        }
        cart.products = cart.products.filter(prd => prd._id._id.toString() != prod._id.toString())
        
        this.#carts = this.#carts.filter(cart => cart._id != id)
        this.#carts.push(cart)
        await this.#writeFile()
        return this.getById(id)
    }   
    
    
    async add({products}){
        await this.#readFile()
        const _id = this.#carts.length  ? Math.max(...this.#carts.map(cart => cart._id)) + 1 : 1
            // const prd = {id:id, }

            this.#carts.push({
                _id: _id.toString(),
                products
            })
            // console.log(this.#carts)
            await this.#writeFile()
            return await this.getById(_id)
    }
}

module.exports = new cartManager('carts.json')
