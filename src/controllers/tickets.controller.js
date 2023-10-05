const ManagerFactory = require('../managers/manager.factory')
const ticketManager = ManagerFactory.getManagerInstance("tickets")

const getTicketController = async (req, res, next) => {

  try {
    const orders = await ticketModel.find({})
      .populate({ path: 'user', select: ['user']})
      .populate({ path: 'products._id', select: ['code','price', 'title']})
      .lean()
    // console.log('getTikt')
    res.send(orders)

} catch (error) {
        
        next(new Error("Ha ocurrido un error inesperado."))
}


}


const getTicketsController = async(req, res, next)=>{

  try {
    const prdRes = await ticketManager.getAllTickets()
    if (prdRes) {
        res.send(prdRes)
        return
    }
    res.status(404).json({ error: 'Se ha producido un error' });  
            
  } catch (error) {
          
          next(new Error("Ha ocurrido un error inesperado."))
  }

}

module.exports = { getTicketsController}
