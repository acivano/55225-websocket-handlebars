const productManager = require('./product.manager')


const productManagerFile = require('./productManagerFS')

const { PERSISTANCE } = require('../config/config')

class ManagerFactory {

  static getManagerInstance(name) {
    if (PERSISTANCE == "mongo") {
        // regresar alguno de los managers de mongo
        switch(name) {
          case "products":
            return productManager
        }
    } else {
      // regresar alguno de los managers de json
      switch(name) {
        case "products":
          return productManagerFile
      }
    }
  }
}

module.exports = ManagerFactory