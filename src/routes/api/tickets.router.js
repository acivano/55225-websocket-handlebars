const { Router } = require('express')
const { getTicketController } = require('../../controllers/tickets.controller')
const router = Router()

router.get('/', getTicketController)

module.exports = router
