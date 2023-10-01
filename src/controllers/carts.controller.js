const config = require('../config/config')
const ManagerFactory = require('../managers/manager.factory')
const productManager = ManagerFactory.getManagerInstance("products")
const cartManager = ManagerFactory.getManagerInstance("carts")

const userManager = ManagerFactory.getManagerInstance("users")
const ticketManager = ManagerFactory.getManagerInstance("tickets")

const updateCartController = async(req, res)=>{
    const uid = req.params.uid
    const user = await userManager.getById(uid)
  
    const products = []
    const response = await cartManager.add({products})
 
    const _user = await userManager.update(uid, {cart: response})
  
    res.status(201).json({'status':'success'})
}
const createTicketController = async(req, res)=>{
    const cid = req.params.cid
    const cart = await cartManager.getById(cid)
    // console.log(cart)

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
    const response = await fetch(`http://${config.URL}:${config.PORT}/api/notification/mail`, requestOptions)

    res.send(newTicket)

}
const productsCartController = async(req, res)=>{
const {products}= req.body
const cid= req.params.cid
let errores= []

const existCart = await cartManager.getById(cid)
if(!existCart){
    res.status(404).json({ error: `The cart with the id ${cid} was not found` }) 
    return
}else{
    for(const element of products){
    
    const existPrd =  await productManager.getById(element._id)

    if(existPrd){
        const exisPrdCart = existCart?.products.some(prd => prd._id?._id?.toString() == element._id)
            if(exisPrdCart){

                existCart.products?.forEach(elm => {

                    if (elm._id._id.toString() == element._id){
                    elm.quantity+= parseInt(element.quantity)
                    }
                })

            }  else {
                const newProd = {'_id': element._id, quantity:parseInt(element.quantity)}
                existCart.products.push(newProd)
            }

    }else{
            let error = `The prod with the id ${element._id} was not found`

            errores.push(error)
        }
    }
    if(errores.length < products.length){

    const productos = {products: existCart.products}
    await cartManager.update(cid, productos)
    }    
    res.status(200).json(errores.length>0?{errors:errores}:{status:'success'})
}
}
const productCartController = async (req, res) => {
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
    const exisPrdCart = existCart?.products?.some(prd => prd._id._id.toString() == pid)
        if(exisPrdCart){

            existCart.products?.forEach(element => {

                if (element._id._id.toString() == pid){
                    element.quantity+= parseInt(quantity)
                }
            })

        }  else {
            const newProd = {'_id': pid, quantity:parseInt(quantity)}
            existCart.products.push(newProd)
        }
        const productos = {products: existCart.products}

    const update = await cartManager.update(cid, productos)
    res.status(200).json({'status':'success'})
    return
}else{
    res.status(404).json({ error: `The cart with the id ${cid} was not found` }) 
    return
}

}
const quantityProductsCartController = async(req, res)=>{
const {cid, pid} = req.params
const cartRes = await cartManager.getQuantityProductCart(cid, pid)

if (cartRes !== null) {
    let response = {'quantity': cartRes}
    res.status(200).json(response)
    return
}
res.status(404).json({ error: `The cart with the id ${id} was not found` });  

}
const getCartController = async(req, res)=>{
const cid = req.params.cid
const cartRes = await cartManager.getById(cid)
if (cartRes) {
    return res.send(cartRes)
    
}
res.status(404).json({ error: `The car with the id ${cid} not exist` });  

}
const deleteCartController = async(req, res)=>{
const id = req.params.id
const cart = await cartManager.getById(id)
if (!cart){
    res.status(404).json({ error: `The cart with the id ${id} was not found` });
    return  
}
await cartManager.delete(id)
res.sendStatus(200)
}
const deleteProductCart = async(req, res)=>{
const cid = req.params.cid
const pid = req.params.pid

const existCart = await cartManager.getById(cid)
if(existCart){
    const update = await cartManager.deleteProductInCart(cid, pid)

    return res.sendStatus(200)
    
}else{
    res.status(404).json({ error: `The cart with the id ${cid} was not found` }) 
    return
}
}

  module.exports = {updateCartController, createTicketController, productsCartController, productCartController, quantityProductsCartController, getCartController, deleteCartController, deleteProductCart}