
function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
      console.log('esta autenticado')
      next()
      return
    }
  
    res.redirect('/login')
}
function isAuthLogin(req, res, next) {
  console.log(req)
    if (!req.isAuthenticated()) {
      console.log('no esta autenticado')

      next()
      return
    }
  
    res.redirect('/')
}
function isAuthAdmin(req, res, next) {
    if (req.user.role =='Admin') {
      console.log('es admin')

      next()
      return
    }
  
    res.redirect('/')
}
function isAuthNotAdmin(req, res, next) {
  if (req.user.role !=='Admin') {
    console.log('no es admin')

    next()
    return
  }

  res.redirect('/')
}

module.exports = {isAuth, isAuthLogin, isAuthAdmin, isAuthNotAdmin}