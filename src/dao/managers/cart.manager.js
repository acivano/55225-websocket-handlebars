const cartModel = require('../models/cart.model')
const productModel = require('../models/product.model')
const userModel = require('../models/user.model')
const BaseManager = require('./base.manager')


class CartManager extends BaseManager{

    constructor(){
        super(cartModel)
    }
    //ok
    // async addCart(){
    //     const products = []
    //     const newCart= await this.model.create({products})
    //     return newCart
        
    // }
    //ok
    // async getCartById(cartId){
    //     const cart = await cartModel.find({_id : cartId}).lean()
    //     return cart[0]
    // }

    async updateCart(id, pid,quantity){
        const cart = await this.model.findOne({_id: id}).lean()
        const prod = await productModel.findOne({_id: pid}).lean()

        const existe = cart?.products?.some(prd => prd._id.toString() == prod._id.toString())
        if(existe){

            cart.products?.forEach(element => {

                if (element._id.toString() == prod._id.toString()){
                    element.quantity+= parseInt(quantity)
                }
            })

        }  else {
            const newProd = {'_id': prod._id.toString(), quantity:parseInt(quantity)}
            cart.products.push(newProd)
        }
        const productos = {products: cart.products}
        const result = await this.model.updateOne({_id: id}, productos)

        return result.modifiedCount >=1? await this.model.findOne({_id: id}).lean():null
    }

    async getQuantityProductCart(id, pid){
        // console.log({id,pid,quantity})
        const cart = await this.model.findOne({_id: id}).lean()

        const prd = cart?.products?.filter(prd => prd._id.toString() == pid)
        
        return prd[0] ? prd[0].quantity : 0
    }

    async deleteProductInCart(id, pid){
        // console.log({id,pid,quantity})
        const cart = await this.model.findOne({_id: id}).lean()

        const prod = await productModel.findOne({_id: pid}).lean()


        if(!cart || !prod){
            return
        }
        const prdsCartNew= cart.products.filter(prd => prd._id.toString() != prod._id.toString())

        const cartNew= {_id: id, products: prdsCartNew}
        const result = await this.model.updateOne({_id: id}, cartNew)
        return result.modifiedCount >=1? prdsCartNew:null
    }
}

module.exports = new CartManager()
