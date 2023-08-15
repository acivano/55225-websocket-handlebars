const fs = require('fs/promises')

const productModel = require('../models/product.model')

class ProductManager{
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
            console.log(sort,query)
            const resultado = await productModel.paginate({$or:[{title :{$regex : query, $options : 'i'}},{category :{$regex : query,$options : 'i'}},{description :{$regex : query,$options : 'i'}},{code :{$regex : query,$options : 'i'}}] }, {limit, page, lean:true, sort:{price: sort}})
            return resultado
        }
        return await productModel.paginate({}, {limit, page, lean:true})

    }
    //ok
    async getProductById(productId){
        const product = await productModel.find({_id : productId}).lean()
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
