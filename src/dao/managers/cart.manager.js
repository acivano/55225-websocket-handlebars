const fs = require('fs/promises')

const cartModel = require('../models/cart.model')
const productModel = require('../models/product.model')


class CartManager{
    //ok
    async addCart(){
        const products = []
        const newCart= await cartModel.create({products})
        return newCart
        
    }
    //ok
    async getCartById(cartId){
        
        const cart = await cartModel.find({_id : cartId}).lean()

        
        console.log(cart)
        return cart? cart[0]:null
    }

    async updateCart(id, pid,quantity){
        const cart = await cartModel.findOne({_id: id}).lean()

        const prod = await productModel.findOne({_id: pid}).lean()

        const existe = cart?.products.some(prd => prd._id.toString() == prod._id.toString())
        if(existe){

            cart.products.forEach(element => {

                if (element._id.toString() == prod._id.toString()){
                    element.quantity+= parseInt(quantity)
                }
            })

        }  else {
            const newProd = {'id': prod._id, quantity:parseInt(quantity)}
            cart.products.push(newProd)

        }
        const productos = {products: cart.products}
        const result = await cartModel.updateOne({_id: id}, productos)
        // const result = await productModel.updateOne({_id:cartId}, cart)}
        return result.modifiedCount >=1? await cartModel.getCartById:null
    }

    async deleteCart(id){
        const prdsNew= {id: id, products: []}

        const result = await cartModel.updateOne({_id:id},prdsNew)
        return result
    }

    async deleteProductInCart(id, pid){
        // console.log({id,pid,quantity})
        const cart = await cartModel.findOne({_id: id}).lean()

        const prod = await productModel.findOne({_id: pid}).lean()

        console.log(cart)
        console.log(prod)

        const prdsCartNew= cart.products.filter(prd => prd._id.toString() != prod._id.toString())

        const cartNew= {_id: id, products: prdsCartNew}
        const result = await cartModel.updateOne({_id: id}, cartNew)

        return result.modifiedCount >=1? prdsCartNew:null
    }
}

module.exports = new CartManager()