const productManager = require('../dao/managers/product.manager')
const cartManager = require('../dao/managers/cart.manager')
const chatManager = require('../dao/managers/chat.manager')




async function socketManager(socket) {
  const products = await productManager.getProducts()
  socket.emit('products',  products)

  const messaes = await chatManager.getMessages()

  socket.emit('chat-messages',  messaes)


  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  socket.on('addProduct', async (producto) => {

    const newProductBack = await productManager.addProduct(producto)
    if(newProductBack){
      const products = await productManager.getProducts()
  
      socket.broadcast.emit('products',  products)
    }
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


  socket.on('addProductoCarrito', async (producto) => {
    // const newCart = await cartManager.addCart()
    // console.log('id')
    // const id = newCart._id.toString()

    //Hardcodeo un id del cart
    const id = '64cfb58653b6696dec02b09a'

    const newProductBack = await cartManager.updateCart(id,producto.id,1)
    console.log(newProductBack)

    socket.emit('addProductoCarrito',  {})
  })


}

module.exports = socketManager