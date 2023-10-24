const cartModel = require('../models/cart.model')
const productModel = require('../models/product.model')
const userManager = require('../managers/user.manager')
const BaseManager = require('./base.manager')
const productManager = require('./product.manager')


class cartManager extends BaseManager{

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

    // async updateCart(id, pid,quantity){
    //     const cart = await this.model.findOne({_id: id}).lean()
    //     const prod = await productModel.findOne({_id: pid}).lean()

    //     const existe = cart?.products?.some(prd => prd._id.toString() == prod._id.toString())
    //     if(existe){

    //         cart.products?.forEach(element => {

    //             if (element._id.toString() == prod._id.toString()){
    //                 element.quantity+= parseInt(quantity)
    //             }
    //         })

    //     }  else {
    //         const newProd = {'_id': prod._id.toString(), quantity:parseInt(quantity)}
    //         cart.products.push(newProd)
    //     }
    //     const productos = {products: cart.products}
    //     const result = await this.model.updateOne({_id: id}, productos)

    //     return result.modifiedCount >=1? await this.model.findOne({_id: id}).lean():null
    // }

    async updateCart(cid, pid,quantity){

        const existCart = await this.getById(cid)
        const user = await this.getUserByCart(cid)
    
        console.log('el usuario es:')
    
        console.log(user)
        const prd = await productManager.getById(pid)
        console.log('el producto es:')
    
        console.log(prd)
        
        if(user.role == 'Premium' && user.user == prd.owner) return null
    
        if(existCart){
    
            const exisPrdCart = existCart?.products?.some(prd => prd._id._id.toString() == pid)
            if(exisPrdCart){
    
                existCart.products?.forEach(element => {

                    if (element._id._id.toString() == pid){
                        element.quantity+= parseInt(quantity)
                        }
                })
    
            } else {
                const newProd = {'_id': pid, quantity:parseInt(quantity)}
                existCart.products.push(newProd)
            }
            const productos = {'_id':cid,products: existCart.products}
            console.log('productos', productos)
            const result = await this.model.updateOne({_id: cid}, productos)
            console.log('result', result)

            return result.modifiedCount >=1? await this.model.findOne({_id: cid}).lean():null
        }
    }
    // socket.on('addProductoCarrito', async (param) => {

    //     const cid = param.idCarrito
    //     const pid = param.id
    //     const quantity = 1
    //     const existCart = await cartManager.getById(cid)
    //     const user = await cartManager.getUserByCart(cid)
    
    //     console.log('el usuario es:')
    
    //     console.log(user)
    //     const prd = await productManager.getById(pid)
    //     console.log('el producto es:')
    
    //     console.log(prd)
        
    //     if(user.role == 'Premium' && user.user == prd.owner) return
    
    //     if(existCart){
    
    //       const exisPrdCart = existCart?.products?.some(prd => prd._id._id.toString() == pid)
    //           if(exisPrdCart){
    
    //               existCart.products?.forEach(element => {
    
    //                   if (element._id._id.toString() == pid){
    //                       element.quantity+= parseInt(quantity)
    //                   }
    //               })
    
    //           }  else {
    //             const newProd = {'_id': pid, quantity:parseInt(quantity)}
    //             existCart.products.push(newProd)
    //           }
    //           const productos = {products: existCart.products}
    
    //       const update = await cartManager.update(cid, productos)
          
    //       const quantityCart = await getQuantityCart(cid)
    
    //       socket.emit('quantity-cart-productos',  quantityCart)
    //     }
    //   })







    async getQuantityProductCart(id, pid){
        // console.log({id,pid,quantity})
        const cart = await this.model.findOne({_id: id}).lean()

        const prd = cart?.products?.filter(prd => prd._id.toString() == pid)
        
        return prd[0] ? prd[0].quantity : 0
    }

    async getUserByCart(id){
        // console.log({id,pid,quantity})
        const users = await userManager.getUsers()

        let user = users.filter(usr => usr.cart == id)

        return user[0]

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

module.exports = new cartManager()
