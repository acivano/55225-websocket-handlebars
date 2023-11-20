const { Router } = require('express')
const {updateUserController, getUserByIdController, getUsers, updateUserRolController, getReducidoUsersController, deleteInactiveUsersController} = require('../../controllers/users.controller')
const router = Router()

router.post('/', updateUserController)
//obtengo usuario por id
router.get('/:uid', getUserByIdController)
router.get('/', getUsers)
router.delete('/deleteInactive', deleteInactiveUsersController)

router.get('/reducido/all', getReducidoUsersController)

router.post('/:uid', updateUserRolController)


module.exports = router
