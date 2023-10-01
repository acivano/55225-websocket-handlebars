const fs = require('fs/promises')
const path = require('path')

class ticketManager{
  #tickets = []
  constructor(file){
      this.filepath = path.join(__dirname, '../data' ,file)
  
  }
  #readFile = async () => {
      const data = await fs.readFile(this.filepath, 'utf-8')
      this.#tickets = JSON.parse(data)
    }
  
  #writeFile = async() => {
  const data = JSON.stringify(this.#tickets, null, 2)
  await fs.writeFile(this.filepath, data)
  }

  async getNextTicket(){

    await this.#readFile()

    const _id = this.#tickets.length  ? Math.max(...this.#tickets.map(prd => prd.code)) + 1 : 1
    return _id
  }
  async getAllTickets() {
    await this.#readFile()
        
    return this.#tickets
}

  async getById(id) {
    await this.#readFile()
    // console.log(this.#tickets.find(prd => prd._id == id))
    return this.#tickets.find(prd => prd._id == id)
  }

  async add(body) {
    // console.log(body)
    await this.#readFile()

      const _id = this.#tickets.length  ? Math.max(...this.#tickets.map(prd => prd._id)) + 1 : 1
        // const prd = {id:id, }

        this.#tickets.push({
            _id: _id.toString(),
            user: body.user,
            code: body.code,
            products: body.products,
            amount: body.amounts,
            purchase_datetime: Date.now()
        })


        await this.#writeFile()
        return await this.getById(_id)
    
  }

  async delete(id) {
    await this.#readFile()

    this.#tickets = this.#tickets.filter(prd => prd.id != productId)
    await this.#writeFile()

  }
}

module.exports = new ticketManager('tickets.json')
