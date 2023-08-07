const fs = require('fs/promises')
const path = require('path')

class CartManager {

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

      async addCart(){
        await this.#readFile()
        const cid = this.#carts.length  ? Math.max(...this.#carts.map(prd => prd.id)) + 1 : 1
        const cart = {'id': parseInt(cid), products:[]} 

        this.#carts.push(cart)
        this.#writeFile()
        return await this.getCartById(cid) 
    }



    async getCartById(cid){
        await this.#readFile()
        return this.#carts.find(cart => cart.id == cid)
    }

    
    async updateCart(id, pid,quantity){
        await this.#readFile()
        //me quedo con el resto de los id de carrito
        const cartNew = this.#carts.filter(cart => cart.id != id)
        //
        const cart = this.#carts.find(cart => cart.id ==id)
        if(cart.products.some(prd => prd.id == pid)){
            cart.products.forEach(element => {
                if (element.id == pid){
                    element.quantity+= parseInt(quantity)
                }
            })
            cartNew.push(cart)
            this.#carts = cartNew
            this.#writeFile()
            return cart
        }  else {
            const newProd = {'id': parseInt(pid), quantity:1}
            cart.products.push(newProd)
            cartNew.push(cart)
            this.#carts = cartNew
            this.#writeFile()
            return cart
        }

    }
}

module.exports = CartManager