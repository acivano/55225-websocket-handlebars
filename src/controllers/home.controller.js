const userManager = require("../managers/user.manager")


const homerViewController = async (req, res) => {
  // res.sendFile(path.join(__dirname, '../public/index.html'))
  // const randomId = getRandomNumber(0, products.length - 1)
  // console.log('homerViewController')
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
  // console.log(id)
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
//queda pendiente
const usersViewController = async (req, res) => {
  // const users = await userManager.getAll()
  // let users2 = users.map(element => {
  //   let inactivo = false
  //   let admin = false
  //   if(Date.now() - element.last_connection > 1800000){
  //     inactivo = true
  //   }
  //   if(element.role== 'Admin'){
  //     admin = true
  //   }
  //    element.admin = admin
  //    element.inactivo = inactivo
  //   return element
     
  // });

  // console.log(users2)
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