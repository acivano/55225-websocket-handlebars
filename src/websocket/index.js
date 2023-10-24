// const productManager = require('../managers/product.manager')
const logger = require('../logger')
const ManagerFactory = require('../managers/manager.factory')
const cartManager = ManagerFactory.getManagerInstance("carts")
const productManager = ManagerFactory.getManagerInstance("products")
const chatManager = ManagerFactory.getManagerInstance("chat")
const { response } = require('express')
const userManager = require('../managers/user.manager')
const config = require('../config/config')

async function socketManager(socket) {

  async function getQuantityCart(id){
    const prdCart = await cartManager.getById(id)
    let quantity = 0
    prdCart.products.forEach(element => {
      quantity=quantity+element.quantity
    });
    return quantity
  }
  
  socket.on('cart', async(id) => {
     const prdCart = await cartManager.getById(id)
    // console.log(prdCart)
    // let quantity = 0
    // prdCart.products.forEach(element => {
    //   console.log(element)
    //   quantity=quantity+element.quantity
    // });
    const quantity = await getQuantityCart(id)
    socket.emit('quantity-cart-productos', quantity)
    socket.emit('cart-productos', prdCart)
  
  })

  socket.on('products', async()=>{
    const products = await productManager.getProducts()
    socket.emit('products',  products)
  })

  socket.on('enviarmail', async(usr)=>{
    try{
      const user = usr.user

      const servicio = `/resetpassword/${user} `
      console.log(servicio)
      const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
          }
      }
      const response = await fetch(`http://${config.URL}:${config.PORT}/resetpassword/${user}`, requestOptions)
      
      socket.emit('enviarmail',  {})
      
    } catch (error) {
        console.log('error')        
    }
  })

  const messages = await chatManager.getMessages()

  socket.emit('chat-messages',  messages)


  socket.on('disconnect', () => {
    logger.debug('user disconnected')
  })

  // socket.on('cart-productos', (id) => {
  //   console.log('petición productos')
  // })

  socket.on('generateTicket', async(obj) => {
    const actualiza = await updateCartFront(obj.id)
  })


  socket.on('delteProduct', async(obj) =>{
    const {cid, pid} = obj

    const result = await cartManager.deleteProductInCart(cid,pid)
    const prdCart = await cartManager.getById(cid)
    let quantity = 0
    prdCart.products.forEach(element => {
      quantity=quantity+element.quantity
    });
    socket.emit('quantity-cart-productos',  quantity)
    socket.emit('cart-productos', prdCart)
  })

  async function updateCartFront(cid){
    const prdCart = await cartManager.getById(cid)
    let quantity = 0
    prdCart.products.forEach(element => {
      quantity=quantity+element.quantity
    });
    socket.emit('quantity-cart-productos',  quantity)
    socket.emit('cart-productos', prdCart)
  }

  socket.on('searchProducto', async (code) => {
    if (code.codeSearch){
      logger.debug(code.codeSearch)
      const product = await productManager.getProductByCode(code.codeSearch)
      logger.debug('search product')
  
      logger.debug(product)
      let producto = product?.owner == code.user || code.role == 'Admin' ? product : null
  
      // console.log(product.owner, code.user, code.role)
      socket.emit('searchProducto',  producto)

    }

  })

  socket.on('addProduct', async (producto) => {
    const newProductBack = await productManager.add(producto)
    if(newProductBack){
      const products = await productManager.getProducts()
      socket.broadcast.emit('products',  products)
    }
  })

  socket.on('editProduct', async (producto) => {
    console.log(producto)
    console.log('antes de editar')

    const updateProduct = await productManager.updateProduct(producto._id, producto)
    console.log('edito')

  })

  
  socket.on('deleteProduct', async (producto) => {
    console.log(producto)
    console.log('antes de eliminar')

    const updateProduct = await productManager.deleteProduct(producto._id)
    console.log(updateProduct)
    console.log('elimino')

  })  

  socket.on('chat-message', async (msg) => {
    // guardar el mensaje en la DB
    await chatManager.addMessage(msg)
    socket.broadcast.emit('chat-message', msg)
  })

  socket.on('chat-messages', async () => {

    const messages = await chatManager.getMessages()
    if(messages){
   
      socket.broadcast.emit('chat-message',  messages)
    }
  })


  socket.on('addProductoCarrito', async (param) => {
    const cid = param.idCarrito
    const pid = param.id
    const update = await cartManager.updateCart(cid, pid, 1)
    if(update){
      const quantityCart = await getQuantityCart(cid)
      socket.emit('quantity-cart-productos',  quantityCart)
    }
    
  })

}

module.exports = socketManager