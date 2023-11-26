const userManager = require("../managers/user.manager")


const homerViewController = async (req, res) => {

  res.render('home', {
    user: req.user ?  {
      ...req.user,
      isAdmin: req.user.role == 'Admin'? '1' : null,
      isPremium: req.user.role == 'Premium'? '1' : null

    } : null
  })
}
const realTimeProductsViewController = (req, res) => {
  res.render('realTimeProducts')
}
const cartViewController = async (req, res) => {
  const id = req.params.id
  res.render('cart',{id,
    user: req.user ?  {
      ...req.user,
      isAdmin: req.user.role == 'Admin'? '1' : null,
      isPremium: req.user.role == 'Premium'? '1' : null

    } : null})
}
const addProductViewController = (req, res) => {
  
  res.render('formProduct',{
    user: req.user ?  {
      ...req.user,
      isAdmin: req.user.role == 'Admin'? '1' : null,
      isPremium: req.user.role == 'Premium'? '1' : null

    } : null
  })
}
const usersViewController = async (req, res) => {
 
  res.render('users',{
    user: req.user ?  {
      ...req.user,
      isAdmin: req.user.role == 'Admin'? '1' : null,
      isPremium: req.user.role == 'Premium'? '1' : null

    } : null})
}
const chatViewController = (req, res) => {
  res.render('chat',{
    user: req.user ?  {
      ...req.user,
      isAdmin: req.user.role == 'Admin'? '1' : null,
      isPremium: req.user.role == 'Premium'? '1' : null

    } : null})
}


module.exports = {homerViewController, realTimeProductsViewController, cartViewController, addProductViewController, chatViewController, usersViewController}