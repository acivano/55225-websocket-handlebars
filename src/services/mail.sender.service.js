const nodemailer = require('nodemailer')
const path = require('path')
const { mail } = require('../config/config')


class MailSender {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      auth: {
        user: mail.GMAIL_ADDRESS,
        pass: mail.GMAIL_PWD
      }
    })
  }

  async send(to, fromEmail, subject, body) {
    const response = await this.transporter.sendMail({
      from: 'no-reply@videojuegos.com',
      subject: subject,
      to,
      html: body
    })

    console.log(response)
  }
}

module.exports = new MailSender()