const { Schema, model } = require('mongoose')

const schema = new Schema({
  user: String,//Correo
  password: String,
  firstname: String,
  lastname:String,
  role:{ type: String, default: 'Custommer' }, //Custommer,Admin,Premium
  cart: { type: Schema.Types.ObjectId, ref: 'carts' },
  createDate:{ type: Number, default: Date.now() }
})

const userModel  = model('users', schema)

module.exports = userModel 