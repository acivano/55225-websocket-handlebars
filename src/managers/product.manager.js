
const productModel = require('../models/product.model')
const BaseManager = require('./base.manager')

class ProductManager extends BaseManager{
    constructor(){
        super(productModel)
    }
    //ok
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
                status,
                category
            })
        }else{
            return
        }
        
    }
    //ok
    async getProducts(page =1, limit=5, sort=null, query=null){
        if (sort||query) {
            const resultado = await productModel.paginate({$and:[{$or:[{title :{$regex : query, $options : 'i'}},{category :{$regex : query,$options : 'i'}},{description :{$regex : query,$options : 'i'}},
                                                            {code :{$regex : query,$options : 'i'}}]},{stock:{$ne: 0}}]} ,{limit, page, lean:true, sort:{price: sort}} )

                                                            
            console.log(resultado)                                                
            return resultado.docs
        }
        const productos = await productModel.paginate({stock:{$ne: 0}}, {limit, page, lean:true})
        console.log(productos)
        return productos.docs
    }
    //ok
    async getProductByCode(code){
        const product = await productModel.find({code : code}).lean()
        // console.log(product[0])
        return product[0]
    }
    //ok
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
