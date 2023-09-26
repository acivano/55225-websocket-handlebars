const { Router } = require('express')
const mailSenderService = require('../../services/mail.sender.service')

const router = Router()

router.post('/mail', async (req, res) => {

    console.log(req.body)
    const to = req.body.to
    const from = req.body.from
    const subject = req.body.subject
    const body = req.body.body
    console.log('aaa')
  // ejecutar send de mail.sender
  const template = `

    <p>Tu pedido en la tienda<p>
    <br/>
    <ol>
      <li>Producto 1</li>
      <li>Producto 2</li>
    </ol>

    <p>Tiene status <span style="color: red">Incompleto</span></p>

    <img src="cid:perrito" />
  `
  await mailSenderService.send(to, from, subject, body)
//   .send('agustincivano@gmail.com', template)

  res.send('OK')
})


module.exports = router