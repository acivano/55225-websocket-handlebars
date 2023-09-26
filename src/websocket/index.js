const productManager = require('../managers/product.manager')
const cartManager = require('../managers/cart.manager')
const chatManager = require('../managers/chat.manager')
const { response } = require('express')

async function socketManager(socket) {

  async function getQuantityCart(id){
    const prdCart = await cartManager.getById(id)
    console.log(prdCart)
    let quantity = 0
    prdCart.products.forEach(element => {
      console.log(element)
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
    console.log('quantity', quantity)
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

  socket.on('generateTicket', async(obj) => {
    const actualiza = await updateCartFront(obj.id)
  })


  socket.on('delteProduct', async(obj) =>{
    const {cid, pid} = obj
    console.log(cid)
    console.log(pid)
    const result = await cartManager.deleteProductInCart(cid,pid)
    const prdCart = await cartManager.getById(cid)
    let quantity = 0
    console.log('prdCart')

    console.log(prdCart)
    prdCart.products.forEach(element => {
      quantity=quantity+element.quantity
    });
    socket.emit('quantity-cart-productos',  quantity)
    socket.emit('cart-productos', prdCart)
  })

  async function updateCartFront(cid){
    const prdCart = await cartManager.getById(cid)
    let quantity = 0
    console.log('prdCart')

    console.log(prdCart)
    prdCart.products.forEach(element => {
      quantity=quantity+element.quantity
    });
    socket.emit('quantity-cart-productos',  quantity)
    socket.emit('cart-productos', prdCart)
  }


  socket.on('addProduct', async (producto) => {



    const newProductBack = await productManager.add(producto)
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

    const cid = param.idCarrito
    const pid = param.id
    const quantity = 1
    const existCart = await cartManager.getById(cid)

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
      
      const quantityCart = await getQuantityCart(cid)

      socket.emit('quantity-cart-productos',  quantityCart)
    }
  })

}

module.exports = socketManager