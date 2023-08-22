const { Schema, model } = require('mongoose')

const schema = new Schema({
user: { type: Schema.Types.ObjectId, ref: 'users' },
  products: { 
    type: [{
      _id: { type: Schema.Types.ObjectId, ref: 'products' },
      quantity: { type: Number, default: 0 }
    }],
    default: []
  }
  // ,
  // createdDate: { type: Number, default: Date.now() }
})
schema.pre("find", function () {
  this.populate({ path: 'products._id', select: ['code', 'title', 'price', 'thumbnail', 'category'] })
})


const cartModel = model('carts', schema)

module.exports = cartModel