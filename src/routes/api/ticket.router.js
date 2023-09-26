const { Router } = require('express')
const ticketModel = require('../../models/ticket.model')
const router = Router()

router.get('/', async (req, res) => {
  const orders = await ticketModel.find({})
    .populate({ path: 'user', select: ['user']})
    .populate({ path: 'products._id', select: ['code','price', 'title']})
    .lean()

    console.log(orders)

  res.send(orders)
})

module.exports = router
