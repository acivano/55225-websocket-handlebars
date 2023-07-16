const { Router } = require('express')
const CartManager = require('../../managers/CartManager')
const ProductManager = require('../../managers/ProductManager')


const router = Router()
const cartManager = new CartManager('carrito.json')
const productManager = new ProductManager('productos.json')

router.post('/' , async(req, res)=>{
  
  const response = await cartManager.addCart()
  res.status(200).json(response)
})


router.post('/:cid/product/:pid', async (req, res) => {
  const cid = req.params.cid
  const pid = req.params.pid
  const existCart = await cartManager.getCartById(cid)
  const existPrd = await productManager.getProductById(pid)
  const quantity = 1 
  if(!existPrd){
    res.status(404).json({ error: `The product with the id ${pid} was not found` }) 
    return
  }
  
  if(existCart){
    const update = await cartManager.updateCart(cid, pid,parseInt(quantity))
    res.status(200).json(update)
    return
  }else{
    res.status(404).json({ error: `The cart with the id ${cid} was not found` }) 
    return
  }

})

router.get('/:cid', async(req, res)=>{
  const id = req.params.cid
  const cartRes = await cartManager.getCartById(id)
  if (cartRes) {
      res.send(cartRes)
      return
  }
  res.status(404).json({ error: `The cart with the id ${id} was not found` });  

})



module.exports = router