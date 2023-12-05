const ManagerFactory = require('../managers/manager.factory')
const userManager = ManagerFactory.getManagerInstance("users")
const { CustomError, ErrorType} = require('../errors/custom.error')
const config = require('../config/config')


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

const updateUserRolController = async (req, res, next) => {
    try {
            
        const uid =  req.params.uid
        const existing = await userManager.getById(uid)
    
        if (!existing) {
            
            res.status(404).json({ error: `The user with the id ${uid} was not found` })
            return
        }
        if (existing.role != 'Admin'){
            let role = existing.role == 'Custommer'? 'Premium' : 'Custommer'

            let usr = { ...existing._doc, role:role}
            const update = await userManager.update(existing._id,usr)
            res.send(usr)
            return
        }    
        res.status(404).json({ error: `The user with the id ${uid} is Admin` })

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

const getUsers = async (req, res, next)=> {

    try {
        const uid = req.params.uid
        const existing = await userManager.getUsers()
        res.send(existing)
    } catch (error) {
            
            next(new CustomError(ErrorType.ID))
    }
       
}

const deleteInactiveUsersController = async (req, res, next)=> {

    try {
        const existing = await userManager.getUsers()

        existing.forEach(async element => {
            if(element.rol !== 'Admin'){
                if(Date.now() - element.last_connection > 1800000){

                    const requestOptions = {
                        method: 'POST',
                        headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                        },
            
                        body:JSON.stringify({
                        to: element.user,
                        from: "no-reply@pruebascoderhouse.com",
                        subject: 'Eliminación de usuario',
                        body: `<h1>Tu usuario fue eliminado por inactividad</h1>`
                        })
                    }
                    const response = await fetch(`${config.URL}/api/notification/mail`, requestOptions)


                    const resultadoDelete = userManager.delete(element._id())
                }
            }
            res.status(201).json({'status':'success', message: 'Eliminados con éxito'})
            
        });

    } catch (error) {
            
            next(new CustomError(ErrorType.ID))
    }
       
}


const getReducidoUsersController = async (req, res, next)=> {
    try {
        const existing = await userManager.getUsers()
        existing.forEach(element => {
            delete element._id
            delete element.password
            delete element.cart
            delete element.createDate
            delete element.__v
            delete element.last_connection


        })
        res.send(existing)
    } catch (error) {
            
            next(new CustomError(ErrorType.General))
    }
       
}


module.exports = {updateUserController, getUserByIdController, getUsers, updateUserRolController, getReducidoUsersController, deleteInactiveUsersController}
