const productManager = require('../dao/managers/product.manager')
const cartManager = require('../dao/managers/cart.manager')
const chatManager = require('../dao/managers/chat.manager')




async function socketManager(socket) {
  
  socket.on('cart', async(id) => {
    const prdCart = await cartManager.getCartById(id)

    socket.emit('cart-productos', prdCart)
  
  })

  const products = await productManager.getProducts()
  console.log('socker products')
  console.log(products)
  socket.emit('products',  products.docs)

  const messages = await chatManager.getMessages()

  socket.emit('chat-messages',  messages)


  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  // socket.on('cart-productos', (id) => {
  //   console.log('petición productos')
  // })
  socket.on('delteProduct', async(obj) =>{
    const {cid, pid} = obj
    console.log(cid)
    console.log(pid)
    const result = await cartManager.deleteProductInCart(cid,pid)

    const prdCart = await cartManager.getCartById(cid)

    socket.emit('cart-productos', prdCart)

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
    const id = '64d94bda62a7a8eeeeb0211d'

    const newProductBack = await cartManager.updateCart(id,producto.id,1)

    socket.emit('addProductoCarrito',  {})
  })


}

module.exports = socketManager