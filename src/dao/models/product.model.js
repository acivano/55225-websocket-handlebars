const { Schema, model } = require('mongoose')

const schema = new Schema({
  code: String,
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  stock: { type: Number, default: 0 },
  status: { type: Boolean, default: true },
  category: String
})

const productModel = model('products', schema)

module.exports = productModel