const ticketModel = require('../../models/ticket.model')

const getTicketController = async (req, res) => {
  const orders = await ticketModel.find({})
    .populate({ path: 'user', select: ['user']})
    .populate({ path: 'products._id', select: ['code','price', 'title']})
    .lean()
  console.log('getTikt')
  res.send(orders)
}

module.exports = {getTicketController}
