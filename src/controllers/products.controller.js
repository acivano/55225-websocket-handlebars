const ManagerFactory = require('../managers/manager.factory')
const productManager = ManagerFactory.getManagerInstance("products")

const getProductController = async(req, res)=>{
    const { query, sort , limit } = req.query
    const ipage = req.query.page
    // console.log(`Buscando productos con ${query}`)


    const prdRes = await productManager.getProducts(ipage, limit,sort,query)
    let prd = prdRes
    // console.log(prdRes)
    // let hasquery = ''
    // let hasSort =''
    // // if (query) {
    // //      filtrar
    // //     prd.docs = prd.docs
    // //       .filter(p => p.code.toLowerCase().includes(query.toLowerCase()) || 
    // //       p.title.toLowerCase().includes(query.toLowerCase()) || 
    // //       p.description.toLowerCase().includes(query.toLowerCase()) || 
    // //       p.category.toLowerCase().includes(query.toLowerCase()))

          
    // //     }
    //   hasquery= query?`&query=${query}`:''
    //   hasSort= sort?`&sort=${sort}`:'' 

    //   const status = prd.docs.length>=1 ? 'success':'error'
    //   const payload = prd.docs
    //   const totalPages = prd.totalPages
    //   const prevPage = prd.prevPage
    //   const nextPage = prd.nextPage
    //   const page = prd.page
    //   const hasPrevPage= prd.hasPrevPage
    //   const hasNextPage = prd.hasNextPage
    //   const prevLink = hasPrevPage? `http://localhost:8081/api/products/?limit=${prd.limit}&page=${prevPage}${hasSort}${hasquery}`:null
    //   const nextLink = hasNextPage? `http://localhost:8081/api/products/?limit=${prd.limit}&page=${nextPage}${hasSort}${hasquery}`:null
      
    //   const respuesta = {status, payload, totalPages, prevPage, nextPage,page, hasPrevPage,hasNextPage, prevLink, nextLink} 
    res.send(prdRes)
}
const getProductByIdController = async(req, res)=>{
    const id = req.params.pid
    const prdRes = await productManager.getById(id)
    if (prdRes) {
        res.send(prdRes)
        return
    }
    res.status(404).json({ error: `The product with the id ${id} was not found` });  

}
const newProductController = async(req, res)=>{
    const {body}  = req

    if(!body.title || !body.description || !body.price || !body.thumbnail || !body.stock || !body.code || !body.category  ){
        res.status(404).json({error:'Todos los datos son obligatorios'})
        return
    }

    if(body.status == undefined){
        body.status = true
    }
    const exist = await productManager.getProductByCode(body.code)
    if(!exist){
        const prdRes = await productManager.add(body)
        if (prdRes) {
            res.status(201).json(prdRes)
            return
        }
    }

    res.status(409).json({ error: `The product with the code ${body.code} alredy exists` });  

}
const updateProductController = async(req, res)=>{
    const {body}  = req
    const id = req.params.id

    const prd = await productManager.update(id, body)
    if(prd.matchedCount < 1){
        res.status(404).json({ error: `The product with the id ${id} was not found` });  
        return
    }
    res.status(202).json(body)

} 
const deleteProductController = async(req, res)=>{
    const id = req.params.id
    const prd = await productManager.getById(id)
    if (!prd){
       res.status(404).json({ error: `The product with the id ${id} was not found` });
       return  
    }
    await productManager.delete(id)
    res.sendStatus(200)

}

module.exports = { getProductByIdController, getProductController, newProductController, updateProductController,deleteProductController }