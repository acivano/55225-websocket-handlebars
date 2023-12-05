
const productModel = require('../models/product.model')
const BaseManager = require('./base.manager')

class ProductManager extends BaseManager{
    constructor(){
        super(productModel)
    }
    
    async addProduct({code, title, description, price, thumbnail, stock, status, category}){
        const exist = await productModel.findOne({code : code})

        if(!exist){

            return productModel.create({
                code,
                title,
                description,
                price,
                thumbnail,
                stock,
                status: true,
                category
            })
        }else{
            return
        }
        
    }
    
    async getProducts(page =1, limit=8, sort=null, query=null){
        if (sort||query) {
            const resultado = await productModel.paginate({$and:[{$or:[{title :{$regex : query, $options : 'i'}},{category :{$regex : query,$options : 'i'}},{description :{$regex : query,$options : 'i'}},
                                                            {code :{$regex : query,$options : 'i'}}]},{stock:{$ne: 0}}]} ,{limit, page, lean:true, sort:{price: sort}} )

                                                            
            return resultado.docs
        }
        const productos = await productModel.paginate({stock:{$ne: 0}}, {limit, page, lean:true})
        return productos.docs
    }
    
    async getProductByCode(code){
        const product = await productModel.find({code : code}).lean()
        return product[0]
    }
    
    async deleteProduct(productId){
        const result = await productModel.deleteOne({_id:productId})
        return result
    }

    async updateProduct(productId, prd){


        const result = await productModel.updateOne({_id: productId}, prd)

        return result
    }
}

module.exports = new ProductManager()
