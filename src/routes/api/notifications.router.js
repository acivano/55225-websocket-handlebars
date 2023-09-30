const { Router } = require('express')
const { mailNotificationController } = require('../../controllers/mail.controller')
const router = Router()

router.post('/mail', mailNotificationController)


module.exports = router