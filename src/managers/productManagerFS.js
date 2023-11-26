const fs = require('fs/promises')
const path = require('path')

class ProductManager {
    #products = []
    constructor(file){
        this.filepath = path.join(__dirname, '../data' ,file)
    
    }
    #readFile = async () => {
        const data = await fs.readFile(this.filepath, 'utf-8')
        this.#products = JSON.parse(data)
      }
    
    #writeFile = async() => {
    const data = JSON.stringify(this.#products, null, 2)
    await fs.writeFile(this.filepath, data)
    }

    async add({code, title, description, price, thumbnail, stock, status, category}){
        await this.#readFile()

        if(!this.#products.find(element => element.code === code)){
            const _id = this.#products.length  ? Math.max(...this.#products.map(prd => prd._id)) + 1 : 1
            // const prd = {id:id, }

            this.#products.push({
                _id: _id.toString(),
                code,
                title,
                description,
                price,
                thumbnail,
                stock,
                status: true,
                category
            })
            await this.#writeFile()
            return await this.getById(_id)
        }else{
            return
        }
        
    }

    async getProducts(){
        await this.#readFile()
        
        return this.#products
    }

    async getProductByCode(code){
        await this.#readFile()

        return this.#products.find(prd => prd.code == code)
    }
    async getById(id){
        await this.#readFile()
        return this.#products.find(prd => prd._id == id)
    }

    async delete(productId){
        await this.#readFile()

        this.#products = this.#products.filter(prd => prd.id != productId)
        await this.#writeFile()

    }

    async update(productId, prd){
        await this.#readFile()
        let existing = await this.getById(productId)

        if(!existing){
            return 
        }
        existing = {...existing, ...prd}
        this.#products = this.#products.filter(prd => prd.id != productId)
        this.#products.push(existing)
        await this.#writeFile()
        return existing
    }


}

module.exports = new ProductManager('productos.json')