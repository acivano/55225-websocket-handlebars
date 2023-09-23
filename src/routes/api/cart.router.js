const { Router } = require('express')

const router = Router()
const cartManager = require('../../dao/managers/cart.manager')
const productManager = require('../../dao/managers/product.manager')
const userManager = require('../../dao/managers/user.manager')

//le actualizo el carrito al usuario
router.post('/:uid' , async(req, res)=>{
  const uid = req.params.uid
  const user = await userManager.getUserById(uid)

  const products = []
  const response = await cartManager.add({products})

  const _user = await userManager.update(uid, {cart: response})

  res.status(201).json({'status':'success'})
})

//actualizo el carrito con productos
router.post('/:cid/products' , async(req, res)=>{
  const {products}= req.body
  const cid= req.params.cid
  let errores= []

  const existCart = await cartManager.getById(cid)
  if(!existCart){
    res.status(404).json({ error: `The cart with the id ${cid} was not found` }) 
    return
  }else{
    for(const element of products){
      
      const existPrd =  await productManager.getProductById(element._id)

      if(existPrd){
        const exisPrdCart = existCart?.products?.some(prd => prd._id._id.toString() == element._id)
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
})

//actualizo el carrito con un producto
router.put('/:cid/product/:pid', async (req, res) => {
  const cid = req.params.cid
  const pid = req.params.pid
  const {quantity} = req.body

  const existPrd = await productManager.getProductById(pid)
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

})
//obtengo la cantidad de un producto del carrito
router.get('/:cid/:pid', async(req, res)=>{
  const {cid, pid} = req.params
  const cartRes = await cartManager.getQuantityProductCart(cid, pid)

  if (cartRes !== null) {
      let response = {'quantity': cartRes}
      res.status(200).json(response)
      return
  }
  res.status(404).json({ error: `The cart with the id ${id} was not found` });  
  
})
//recupero un carrito por su id
router.get('/:cid', async(req, res)=>{
  const cid = req.params.cid
  const cartRes = await cartManager.getById(cid)
  if (cartRes) {
    return res.send(cartRes)
      
  }
  res.status(404).json({ error: `The car with the id ${cid} not exist` });  

})

//elimino un carrito
router.delete('/:id', async(req, res)=>{
  const id = req.params.id
  const cart = await cartManager.getById(id)
  if (!cart){
     res.status(404).json({ error: `The cart with the id ${id} was not found` });
     return  
  }
  await cartManager.delete(id)
  res.sendStatus(200)
})

//elimino un producto del carrito
router.delete('/:cid/product/:pid', async(req, res)=>{
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
})


module.exports = router