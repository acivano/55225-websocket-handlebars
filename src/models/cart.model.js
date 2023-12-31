const { Schema, model } = require('mongoose')

const schema = new Schema({
  products: { 
    type: [{
      _id: { type: Schema.Types.ObjectId, ref: 'products' },
      quantity: { type: Number, default: 0 }
    }],
    default: []
  }

})
schema.pre("find", function () {
  this.populate({ path: 'products._id', select: ['code', 'title', 'price', 'thumbnail', 'category'] })
})


const cartModel = model('carts', schema)

module.exports = cartModel