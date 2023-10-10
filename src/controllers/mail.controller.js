const mailSenderService = require('../services/mail.sender.service')
const mailNotificationController = async (req, res, next) => {


  try {
            
    const to = req.body.to
    const from = req.body.from
    const subject = req.body.subject
    const body = req.body.body
  // ejecutar send de mail.sender
  
    await mailSenderService.send(to, from, subject, body)
    res.send('OK')

  } catch (error) {
          
    next(new CustomError(ErrorType.General))
  }

}

  module.exports = {mailNotificationController}