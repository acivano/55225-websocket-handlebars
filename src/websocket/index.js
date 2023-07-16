const ProductManager = require('../managers/ProductManager.js')
const productManager = new ProductManager('productos.json')


async function socketManager(socket) {
  const products = await productManager.getProducts()
  socket.emit('products',  products)

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  socket.on('addProduct', async (producto) => {
    const insertarPrd = fetch('http://localhost:8080/api/products', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
  })
})

}

module.exports = socketManager