const fs = require('fs/promises')

const cartModel = require('../models/cart.model')
const productModel = require('../models/product.model')
const userModel = require('../models/user.model')


class CartManager{
    //ok
    async addCart(){
        // const user = uid
        const products = []
        const newCart= await cartModel.create({products})
        return newCart
        
    }
    //ok
    async getCartById(cartId){
        
        const cart = await cartModel.find({_id : cartId}).lean()

        console.log('cart')

        console.log(cart)
        return cart? cart[0]:null
    }

    async getCartByUser(uid){
        
        const user = await userModel.find({_id: uid}).lean()
        if(!user){
            return null
        }
        const cart = await cartModel.find({user : uid}).lean()

        
        console.log(cart)
        return cart? cart[0]:null
    }

    async updateCart(id, pid,quantity){
        console.log('updateCart')
        console.log('cart', id)
        console.log('product', pid)

        const cart = await cartModel.findOne({_id: id}).lean()
        console.log(cart)

        const prod = await productModel.findOne({_id: pid}).lean()
        console.log(prod)

        const existe = cart.products?.some(prd => prd._id.toString() == prod._id.toString())
        if(existe){
            console.log(existe)

            cart.products?.forEach(element => {

                if (element._id.toString() == prod._id.toString()){
                    element.quantity+= parseInt(quantity)
                }
            })

        }  else {
            const newProd = {'_id': prod._id.toString(), quantity:parseInt(quantity)}
            cart.products.push(newProd)
            console.log('cart luego de pushear')
            console.log(cart)

        }
        const productos = {products: cart.products}
        console.log(productos)
        const result = await cartModel.updateOne({_id: id}, productos)
        console.log('result')

        console.log(result)
        return result.modifiedCount >=1? await cartModel.findOne({_id: id}).lean():null
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
        if(!cart || !prod){
            return
        }
        const prdsCartNew= cart.products.filter(prd => prd._id.toString() != prod._id.toString())

        const cartNew= {_id: id, products: prdsCartNew}
        const result = await cartModel.updateOne({_id: id}, cartNew)
        console.log(result.modifiedCount)
        return result.modifiedCount >=1? prdsCartNew:null
    }
}

module.exports = new CartManager()
