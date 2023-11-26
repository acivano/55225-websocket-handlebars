const config = require('../config/config')

const { CustomError, ErrorType } = require('../errors/custom.error')
const ManagerFactory = require('../managers/manager.factory')
const productManager = ManagerFactory.getManagerInstance("products")

const getProductController = async(req, res, next)=>{


    try {
            
        const { query, sort , limit } = req.query
        const ipage = req.query.page
    
    
        const prdRes = await productManager.getProducts(ipage, limit,sort,query)
        let prd = prdRes
        
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
        if (!prd){
           res.status(404).json({ error: `The product with the id ${id} was not found` });
           return  
        }
        if (prd.owner !== 'Admin') {
            const requestOptions = {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
    
                body:JSON.stringify({
                to: prd.owner,//hardcodeo por las dudas - debería ir prd.owner
                from: "no-reply@pruebascoderhouse.com",
                subject: `El producto ${prd.code} eliminado`,
                body: `<p>El producto con código ${prd.code}, ha sido eliminado de manera permanente<p>`
                })
            }
            const response = await fetch(`${config.URL}/api/notification/mail`, requestOptions)
            // const response = await fetch(`http://${config.URL}:${config.PORT}/api/notification/mail`, requestOptions)

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