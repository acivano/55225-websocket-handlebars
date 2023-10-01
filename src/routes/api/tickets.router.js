const { Router } = require('express')
const { getTicketsController } = require('../../controllers/tickets.controller')
const router = Router()

router.get('/', getTicketsController)

module.exports = router
