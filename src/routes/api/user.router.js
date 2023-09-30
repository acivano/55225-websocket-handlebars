const { Router } = require('express')
const {updateUserController, getUserByIdController} = require('../../controllers/users.controller')
const router = Router()

router.post('/', updateUserController)
//obtengo usuario por id
router.get('/:uid', getUserByIdController)

module.exports = router
