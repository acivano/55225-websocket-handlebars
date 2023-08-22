const productManager = require('../dao/managers/product.manager')
const cartManager = require('../dao/managers/cart.manager')
const chatManager = require('../dao/managers/chat.manager')

async function socketManager(socket) {
  
  socket.on('cart', async(id) => {
    const prdCart = await cartManager.getCartById(id)
    console.log(prdCart)
    let quantity = 0
    prdCart.products.forEach(element => {
      quantity=quantity+element.quantity
    });
    socket.emit('quantity-cart-productos', quantity)
    socket.emit('cart-productos', prdCart)
  
  })

  socket.on('products', async()=>{
    console.log('se conecto producto')
    const products = await productManager.getProducts()
    console.log('socker products')
    // console.log(products)
    socket.emit('products',  products.docs)
  })

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
    let quantity = 0
    console.log('prdCart')

    console.log(prdCart)
    prdCart.products.forEach(element => {
      quantity=quantity+element.quantity
    });
    socket.emit('quantity-cart-productos',  quantity)
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


  socket.on('addProductoCarrito', async (param) => {
    // const newCart = await cartManager.addCart()
    // console.log('id')
    // const id = newCart._id.toString()

    //Hardcodeo un id del cart
    const id = param.idCarrito
    const idProducto = param.id

    const newProductBack = await cartManager.updateCart(id,idProducto,1)
    console.log('newProductBack')

    console.log(newProductBack)
    let quantity = 0
    newProductBack.products.forEach(element => {
      quantity=quantity+element.quantity
    });
    socket.emit('quantity-cart-productos',  quantity)
  })


}

module.exports = socketManager