function isAuth(req, res, next) {
    if (req.user) {
      next()
      return
    }
  
    res.redirect('/login')
}
function isAuthLogin(req, res, next) {
    if (!req.user) {
      next()
      return
    }
  
    res.redirect('/')
}
function isAuthAdmin(req, res, next) {
    if (req.user.role =='Admin') {
      next()
      return
    }
  
    res.redirect('/')
}

module.exports = {isAuth, isAuthLogin, isAuthAdmin}