
class BaseManager {
    constructor(model) {
      this.model = model
    }
  
    getAll() {
      return this.model.find().lean()
    }
  
    getAllPaged(page = 1, limit = 5) {
    
      return this.model.paginate({}, { limit, page, lean: true })
    }
  
    async getById(id) {
      const entities = await this.model.find({ _id: id })
      return entities[0]
    }
  
    //cart -> producto = []
    //product -> no existe previamente con el code
    //user
    async add(body) {
        return this.model.create(body)
    }
    //cart -> cart existente, producto existente, products actualizado con sus quantity actualizado, 
    //no devuelve el elemento insertado
    async update(id, entity) {
      const result = await this.model.updateOne({ _id: id }, entity)
  
      return result
    }
  
    async delete(id) {
      const result = await this.model.deleteOne({ _id: id })
  
      return result
    }
  }
  
  module.exports = BaseManager