const {Router} = require('express')
const ProductManager = require('../../managers/ProductManager')

const productManager = new ProductManager('productos.json')
const router = Router()

router.get('/', async(req, res)=>{
    const limit = req.query.limit 
    const prd = await productManager.getProducts()
    let prdRes = prd
    if(limit){
        prdRes = prd.slice(0,limit)
    }
    res.send(prdRes)
})

router.get('/:pid', async(req, res)=>{
    const id = req.params.pid
    const prdRes = await productManager.getProductById(id)
    if (prdRes) {
        res.send(prdRes)
        return
    }
    res.status(404).json({ error: `The product with the id ${id} was not found` });  

})

router.post('/', async(req, res)=>{
    const {body}  = req

    if(!body.title || !body.description || !body.price || !body.thumbnail || !body.stock || !body.code || !body.category  ){
        res.status(404).json({error:'Todos los datos son obligatorios'})
        return
    }

    if(body.status == undefined){
        body.status = true
    }
    
    const prdRes = await productManager.addProduct(body)
    if (prdRes) {
        res.status(201).json(prdRes)
        return
    }
    res.status(409).json({ error: `The product with the code ${body.code} alredy exists` });  

})    

router.put('/:id', async(req, res)=>{
    const {body}  = req
    const id = req.params.id

    const prd = await productManager.updateProduct(id, body)
    if(!prd){
        res.status(404).json({ error: `The product with the id ${id} was not found` });  
        return
    }
    res.status(202).json(prd)

})

router.delete('/:id', async(req, res)=>{
    const id = req.params.id
    const prd = await productManager.getProductById(id)
    if (!prd){
       res.status(404).json({ error: `The product with the id ${id} was not found` });
       return  
    }
    await productManager.deleteProduct(id)
    res.sendStatus(200)

})

module.exports = router