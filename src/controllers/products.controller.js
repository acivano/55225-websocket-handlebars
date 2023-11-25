const config = require('../config/config')

const { CustomError, ErrorType } = require('../errors/custom.error')
const ManagerFactory = require('../managers/manager.factory')
const productManager = ManagerFactory.getManagerInstance("products")

const getProductController = async(req, res, next)=>{


    try {
            
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

    } catch (error) {
              
        next(new CustomError(ErrorType.General))
    }


}
const getProductByIdController = async(req, res, next)=>{

    try {
            
        const id = req.params.pid
        const prdRes = await productManager.getById(id)
        if (prdRes) {
            res.send(prdRes)
            return
        }
        res.status(404).json({ error: `The product with the id ${id} was not found` });  

    
      } catch (error) {
              
        next(new CustomError(ErrorType.General))
      }

}
const newProductController = async(req, res, next)=>{

    try {
            
        const {body}  = req
        console.log(body)
    
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

    
    } catch (error) {
            
        next(new CustomError(ErrorType.General))
    }



}
const updateProductController = async(req, res, next)=>{


    try {
            
        
            const {body}  = req
            const id = req.params.id
        
            const prd = await productManager.update(id, body)
            if(prd.matchedCount < 1){
                res.status(404).json({ error: `The product with the id ${id} was not found` });  
                return
            }
            res.status(202).json(body)

    
    } catch (error) {
            
        next(new CustomError(ErrorType.General))
    }

} 
const deleteProductController = async(req, res, next)=>{

    try {
            
        const id = req.params.id
        const prd = await productManager.getById(id)
        console.log(prd)
        if (!prd){
           res.status(404).json({ error: `The product with the id ${id} was not found` });
           return  
        }
        if (prd.owner !== 'Admin') {
            console.log('no es admin')
            const requestOptions = {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
    
                body:JSON.stringify({
                to: "agustincivano@gmail.com",//hardcodeo por las dudas - debería ir prd.owner
                from: "no-reply@pruebascoderhoyse.com",
                subject: `El producto ${prd.code} eliminado`,
                body: `<p>El producto con código ${prd.code}, ha sido eliminado de manera permanente<p>`
                })
            }
            console.log(requestOptions)
            const response = await fetch(`https://55225-agustincivano-production.up.railway.app/api/notification/mail`, requestOptions)
            // const response = await fetch(`http://${config.URL}:${config.PORT}/api/notification/mail`, requestOptions)

            console.log(response)    
        }
        const rta = await productManager.delete(id)
        if(rta.deletedCount>0){
            res.status(200).json({status: 'success', message:'Registrado con éxito'})
        }

    
    } catch (error) {
            
        next(new CustomError(ErrorType.General))
    }



}

module.exports = { getProductByIdController, getProductController, newProductController, updateProductController,deleteProductController }