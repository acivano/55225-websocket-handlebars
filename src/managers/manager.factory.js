const productManager = require('./product.manager')
const productManagerFile = require('./productManagerFS')
const chatManager = require('./chat.manager')
const chatManagerFile = require('./chatManagerFS')
const cartManager = require('./cart.manager')
const cartManagerFile = require('./cartManagerFS')
const userManager = require('./user.manager')
const userManagerFile = require('./userMangerFS')
const ticketManager = require('./ticket.manager')
const ticketManagerFS = require('./ticketManagerFS')

const { PERSISTANCE } = require('../config/config')

class ManagerFactory {

  static getManagerInstance(name) {
    if (PERSISTANCE == "mongo") {
        switch(name) {
          case "products":
            return productManager
          case "chat":
            return chatManager 
          case "carts":
            return cartManager    
          case "users":
            return userManager      
          case "tickets":
            return ticketManager        
        }
    } else {
      switch(name) {
        case "products":
          return productManagerFile
        case "chat":
          return chatManagerFile
        case "carts":
          return cartManagerFile
        case "users":
          return userManagerFile
        case "tickets":
          return ticketManagerFS              
      }
    }
  }
}

module.exports = ManagerFactory