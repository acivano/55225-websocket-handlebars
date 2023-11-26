const ticketModel = require('../models/ticket.model')
const BaseManager = require('./base.manager')

class ticketManager extends BaseManager {
  constructor() {
    super(ticketModel)
  }

  async getNextTicket(){
    const codeTkt = await ticketModel.find({}).sort({code:-1}).limit(1)
    return codeTkt[0]?.code??0
  }

  async getAllTickets(){
    const orders = await ticketModel.find({})
      .populate({ path: 'user', select: ['user']})
      .populate({ path: 'products._id', select: ['code','price', 'title']})
      .lean()
    return orders
  }
}

module.exports = new ticketManager() // singleton
