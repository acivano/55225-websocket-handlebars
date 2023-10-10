const ManagerFactory = require('../managers/manager.factory')
const userManager = ManagerFactory.getManagerInstance("users")
const { CustomError, ErrorType} = require('../errors/custom.error')

const updateUserController = async (req, res, next) => {
    try {
            
        const user =  req.body
        const existing = await userManager.getUserByUsername(user.user)
    
        if (!existing) {
            
            const created = await userManager.add(user)
            res.send(created)
            return
        }
        
        const update = await userManager.update(existing._id,user)
        res.send(user)
    
    } catch (error) {
            
        next(new CustomError(ErrorType.General))
    }

}
const getUserByIdController = async (req, res, next)=> {

    try {
        const uid = req.params.uid
        const existing = await userManager.getById(uid)
        if (!existing || existing == null) {
            res.status(404).json({ error: `The user with the id ${uid} was not found` })
            return
        }
        res.send(existing)
    } catch (error) {
            
            next(new CustomError(ErrorType.ID))
    }
       
}


module.exports = {updateUserController, getUserByIdController}
