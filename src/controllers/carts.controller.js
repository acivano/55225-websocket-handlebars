const config = require('../config/config')
const { CustomError, ErrorType } = require('../errors/custom.error')
const logger = require('../logger')
const ManagerFactory = require('../managers/manager.factory')
const productManager = ManagerFactory.getManagerInstance("products")
const cartManager = ManagerFactory.getManagerInstance("carts")
const userManager = ManagerFactory.getManagerInstance("users")
const ticketManager = ManagerFactory.getManagerInstance("tickets")

const updateCartController = async(req, res, next)=>{

    try {
       
        const uid = req.params.uid
        const user = await userManager.getById(uid)
      
        const products = []
        const response = await cartManager.add({products})
     
        const _user = await userManager.update(uid, {cart: response})
      
        res.status(201).json({'status':'success', message: 'Asociado con éxito'})
    } catch (error) {
        next(new CustomError(ErrorType.ID))

    }
}
const createTicketController = async(req, res, next)=>{
    logger.info('entró al crear ticket')

    try {
        const cid = req.params.cid
        const cart = await cartManager.getById(cid)
        logger.debug(cart)
    
        if(!cart){return res.sendStatus(404)}
    
        const productsCart = cart.products
        const newProductsCart = []
        // _id: { type: Schema.Types.ObjectId, ref: 'products' },
        // quantity: { type: Number, default: 0 }
        const productsTicket = []
    
        for (prd of productsCart){
            // console.log('cada producto')
    
            const prodData = await productManager.getById(prd._id)
            // console.log(prodData)
    
            if(prodData.stock == 0){
                newProductsCart.push({
                    _id: prodData._id,
                    quantity: prd.quantity
                })
            }else{
                const toBuy = prodData.stock >= prd.quantity ? prd.quantity : prodData.stock
    
                productsTicket.push({
                    id: prodData._id,
                    price: prodData.price,
                    quantity: toBuy
                })
    
                prodData.stock = prodData.stock - toBuy
    
                await productManager.update(prodData._id, prodData)
    
                if (toBuy !== prd.quantity){
                    newProductsCart.push({
                    _id: prodData._id,
                    quantity: prd.quantity - toBuy
                    })
                }
            }
        }
    
        const updateCart = await cartManager.update(cid, {products: newProductsCart})
        const code = await ticketManager.getNextTicket()
        // console.log(req.user)
    
        const ticket = {
            user: req.user?._id ?? "",
            code: code+1,
            amount: productsTicket.reduce((total, {price, quantity}) => (price * quantity) + total, 0),
            products: productsTicket.map(({id, quantity})=> {
            return {
                _id : id,
                quantity
            }
            })
        }
    
        const newTicket = await ticketManager.add(ticket)
        logger.info(newTicket)
    
        const requestOptions = {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },

            body:JSON.stringify({
            to: "agustincivano@gmail.com",//hardcodeo por las dudas
            from: "no-reply@pruebascoderhoyse.com",
            subject: 'Tu compra fue confirmada',
            body: `<p>Compra confirmada $${ticket.amount} - Codigo compra: ${ticket.code}<p>`
            })
        }
        const response = await fetch(`https://55225-agustincivano-production.up.railway.app/api/notification/mail`, requestOptions)
        // const response = await fetch(`http://${config.URL}:${config.PORT}/api/notification/mail`, requestOptions)
        console.log(response)

    
        res.send(newTicket)          

    } catch (error) {
            
        next(new CustomError(ErrorType.General))
    }

}

const productsCartController = async(req, res, next)=>{

    try {
        
        const {products}= req.body
        const cid= req.params.cid
        let errores= []
    
        const existCart = await cartManager.getById(cid)
        logger.info(existCart)

        if(!existCart){
            next(new CustomError(ErrorType.ID))
            return
        }else{
            logger.info(products)
            for(const element of products){
            
            console.log(element)
            const existPrd =  await productManager.getById(element._id)
            console.log(existPrd)
    
            if(existPrd){
                console.log('cid, element._id, element.quantity')

                console.log(cid, element._id, element.quantity)
                const update = await cartManager.updateCart(cid, element._id, element.quantity)
                console.log(update)
                console.log('update')

                if(!update){
                    let error = `The product with the id ${element._id} cannot be added to this cart`
                    errores.push(error)
                }    
            }else{
                    let error = `The prod with the id ${element._id} was not found`

                    errores.push(error)
                }
            }

            res.status(200).json(errores.length>0?{errors:errores}:{status:'success'})
        
        }
    } catch (error) {
            
        next(new CustomError(ErrorType.General))
    }
    
}

const productCartController = async (req, res, next) => {
    try {
        console.log('productCartController')
        const cid = req.params.cid
        const pid = req.params.pid
        const {quantity} = req.body

        const existPrd = await productManager.getById(pid)
        const existCart = await cartManager.getById(cid)
        if(!existPrd){
            res.status(404).json({ error: `The product with the id ${pid} was not found` }) 
            return
        }

        if(existCart){
            const update = await cartManager.updateCart(cid, pid, quantity)
            if(update){
                res.status(200).json({'status':'success'})
                return
            }
            res.status(404).json({ error: `The product cannot be added to the cart` }) 
            return
        }else{
            res.status(404).json({ error: `The cart with the id ${cid} was not found` }) 
            return
        }       

    } catch (error) {
            
            next(new CustomError(ErrorType.General))
    }
            
        

}

const quantityProductsCartController = async(req, res, next)=>{
    try {
            
        const {cid, pid} = req.params
        const cartRes = await cartManager.getQuantityProductCart(cid, pid)
    
        if (cartRes !== null) {
            let response = {'quantity': cartRes}
            res.status(200).json(response)
            return
        }
        res.status(404).json({ error: `The cart with the id ${id} was not found` });  
    } catch (error) {
            
            next(new CustomError(ErrorType.General))
    }
    

}
const getCartController = async(req, res, next)=>{
    try {
        const cid = req.params.cid
        const cartRes = await cartManager.getById(cid)
        if (cartRes) {
            return res.send(cartRes)
            
        }
        next(new CustomError(ErrorType.ID))

    } catch (error) {
            
            next(new CustomError(ErrorType.General))
    }
    

}
const deleteCartController = async(req, res, next)=>{
    try {
            
        const id = req.params.id
        const cart = await cartManager.getById(id)
        if (!cart){
            res.status(404).json({ error: `The cart with the id ${id} was not found` });
            return  
        }
        await cartManager.delete(id)
        res.sendStatus(200)

    } catch (error) {
            
        next(new CustomError(ErrorType.General))
    }
}
const deleteProductCart = async(req, res, next)=>{
    try {
            
        const cid = req.params.cid
        const pid = req.params.pid
    
        const existCart = await cartManager.getById(cid)
        if(existCart){
            const update = await cartManager.deleteProductInCart(cid, pid)
    
            return res.status(200).send({status:'success', message:'Eliminado con éxito'})
            
        }else{
            next(new CustomError(ErrorType.ID))

        }

    } catch (error) {
            
        next(new CustomError(ErrorType.General))
    }
}

  module.exports = {updateCartController, createTicketController, productsCartController, productCartController, quantityProductsCartController, getCartController, deleteCartController, deleteProductCart}