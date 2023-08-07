const fs = require('fs/promises')

const cartModel = require('../models/cart.model')
const productModel = require('../models/product.model')

class CartManager{
    //ok
    async addCart(){
        const products = []
        return await cartModel.create({products})
        
    }
    //ok
    async getCartById(cartId){
        
        const cart = await cartModel.find({_id : cartId}).lean()

        

        return cart? cart[0]:null
    }

    async updateCart(id, pid,quantity){
        const cart = await cartModel.findOne({_id: id}).lean()
        const prod = await productModel.findOne({code: pid}).lean()
        console.log(prod)


        if(cart.products.some(prd => prd._id == prod._id)){
            cart.products.forEach(element => {
                if (element._id == prod._id){
                    element.quantity+= parseInt(quantity)
                }
            })

        }  else {
            const newProd = {'_id': prod._id, quantity:1}
            cart.products.push(newProd)

        }
        const prdsNew= {_id: id, products: cart.products}
        const result = await cartModel.updateOne({_id: id}, {prdsNew})
        // const result = await productModel.updateOne({_id:cartId}, {cart})
        return result
    }
}

module.exports = new CartManager()
