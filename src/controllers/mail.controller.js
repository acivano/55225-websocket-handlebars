const { CustomError, ErrorType } = require('../errors/custom.error')
const logger = require('../logger')

const mailSenderService = require('../services/mail.sender.service')

const mailNotificationController = async (req, res, next) => {


  try {
            
    const to = req.body.to
    const from = req.body.from
    const subject = req.body.subject
    const body = req.body.body
  // ejecutar send de mail.sender
    logger.info(to, from, subject, body)
  
    await mailSenderService.send(to, from, subject, body)
    res.send('OK')

  } catch (error) {
          
    next(new CustomError(ErrorType.General))
  }

}

  module.exports = {mailNotificationController}