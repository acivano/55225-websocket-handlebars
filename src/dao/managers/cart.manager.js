const fs = require('fs/promises')

const cartModel = require('../models/cart.model')
const productModel = require('../models/product.model')

class CartManager{
    //ok
    async addCart(){
        const products = []
        const newCart= await cartModel.create({products})
        console.log(newCart)
        return newCart
        
    }
    //ok
    async getCartById(cartId){
        
        const cart = await cartModel.find({_id : cartId}).lean()

        

        return cart? cart[0]:null
    }

    async updateCart(id, pid,quantity){
        // console.log({id,pid,quantity})
        const cart = await cartModel.findOne({_id: id}).lean()
        console.log('cart.products')

        console.log(cart.products)
        const prod = await productModel.findOne({_id: pid}).lean()
        console.log(prod)


        if(cart.products.some(prd => prd._id.toString() == prod._id.toString())){
            console.log('entro al some')
            cart.products.forEach(element => {
                if (element._id.toString() == prod._id.toString()){
                    element.quantity+= parseInt(quantity)
                }
            })

        }  else {
            const newProd = {'_id': prod._id, quantity:1}
            cart.products.push(newProd)

        }
        const prdsNew= {_id: id, products: cart.products}
        console.log(prdsNew)
        const result = await cartModel.updateOne({_id: id}, prdsNew)
        // const result = await productModel.updateOne({_id:cartId}, cart)}
        return result.modifiedCount >=1? prdsNew:null
    }
}

module.exports = new CartManager()
