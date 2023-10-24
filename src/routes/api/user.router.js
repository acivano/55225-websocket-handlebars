const { Router } = require('express')
const {updateUserController, getUserByIdController, getUsers, updateUserRolController} = require('../../controllers/users.controller')
const router = Router()

router.post('/', updateUserController)
//obtengo usuario por id
router.get('/:uid', getUserByIdController)
router.get('/', getUsers)
router.post('/premium/:uid', updateUserRolController)


module.exports = router
