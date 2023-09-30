

const homerViewController = async (req, res) => {
  // res.sendFile(path.join(__dirname, '../public/index.html'))
  // const randomId = getRandomNumber(0, products.length - 1)

  res.render('home', {
    user: req.user ?  {
      ...req.user,
      isAdmin: req.user.role == 'Admin'? '1' : null
    } : null
  })
}
const realTimeProductsViewController = (req, res) => {
  res.render('realTimeProducts')
}
const cartViewController = async (req, res) => {
  const id = req.params.id
  console.log(id)
  res.render('cart',{id,
    user: req.user ?  {
      ...req.user,
      isAdmin: req.user.role == 'Admin'? '1' : null
    } : null})
}
const addProductViewController = (req, res) => {
  res.render('formProduct',{
    user: req.user ?  {
      ...req.user,
      isAdmin: req.user.role == 'Admin'? '1' : null
    } : null
  })
}
const chatViewController = (req, res) => {
  res.render('chat',{
    user: req.user ?  {
      ...req.user,
      isAdmin: req.user.role == 'Admin'? '1' : null
    } : null})
}


module.exports = {homerViewController, realTimeProductsViewController, cartViewController, addProductViewController, chatViewController}