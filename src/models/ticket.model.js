const { Schema, model } = require('mongoose')

const schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'users' },
  code: {type: Number, default: 0},
  products: { 
    type: [{
      _id: { type: Schema.Types.ObjectId, ref: 'products' },
      quantity: { type: Number, default: 0 }
    }],
    default: []
  },
  amount:{type: Number, default:0},
  purchase_datetime: { type: Number, default: Date.now() }
})

const ticketModel = model('tickets', schema)

module.exports = ticketModel