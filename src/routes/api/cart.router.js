const { Router } = require('express')

const router = Router()
const cartManager = require('../../dao/managers/cart.manager')
const productManager = require('../../dao/managers/product.manager')
const userManager = require('../../dao/managers/user.manager')


router.post('/:uid' , async(req, res)=>{
  const uid = req.params.uid
  const user = await userManager.getUserById(uid)
  console.log('user')

  console.log(user)
  const response = await cartManager.addCart()

  const updateUser = {
    ...user,
    cart: cart._id
  }
  const _user = await userManager.updateUser(updateUser)
  console.log(_user)
  res.status(201).json(response)
})

router.post('/:cid/products' , async(req, res)=>{
  const {products}= req.body
  const cid= req.params.cid
  let errores= []

  const existCart = await cartManager.getCartById(cid)
  if(!existCart){
    res.status(404).json({ error: `The cart with the id ${pid} was not found` }) 
    return
  }else{
    for(const element of products){
      
      const existPrd =  await productManager.getProductById(element._id)

      if(existPrd){
        const resultado = await cartManager.updateCart(cid, element._id,parseInt(element.quantity))
      }else{
            let error = `The prod with the id ${element._id} was not found`

            errores.push(error)
          }
    }
    
    res.status(200).json(errores.length>0?{errors:errores}:{resultado:'Ok'})
  }
})


router.put('/:cid/product/:pid', async (req, res) => {
  const cid = req.params.cid
  const pid = req.params.pid
  const {quantity} = req.body


  const existPrd = await productManager.getProductById(pid)
  console.log(existPrd)
  const existCart = await cartManager.getCartById(cid)
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
  console.log(cartRes)
  if (cartRes) {
      res.send(cartRes)
      return
  }
  res.status(404).json({ error: `The cart with the id ${id} was not found` });  

})

router.get('/user/:uid', async(req, res)=>{
  const uid = req.params.uid
  const cartRes = await cartManager.getCartByUser(uid)
  console.log(cartRes)
  if (cartRes) {
      res.send(cartRes)
      return
  }
  res.status(404).json({ error: `The user with the id ${uid} does not have a cart` });  

})


router.delete('/:id', async(req, res)=>{
  const id = req.params.id
  const cart = await cartManager.getCartById(id)
  if (!cart){
     res.status(404).json({ error: `The cart with the id ${id} was not found` });
     return  
  }
  await cartManager.deleteCart(id)
  res.sendStatus(200)
})

router.delete('/:cid/product/:pid', async(req, res)=>{
  const cid = req.params.cid
  const pid = req.params.pid


  const existCart = await cartManager.getCartById(cid)
  if(existCart){
    const update = await cartManager.deleteProductInCart(cid, pid)
    console.log('update')
    console.log(update)
    return res.sendStatus(200)
    
  }else{
    res.status(404).json({ error: `The cart with the id ${cid} was not found` }) 
    return
  }
})


module.exports = router