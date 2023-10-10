const logger = require("../logger")

function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
      logger.info('esta autenticado')
      next()
      return
    }
  
    res.redirect('/login')
}
function isAuthLogin(req, res, next) {
    if (!req.isAuthenticated()) {
      logger.info('no esta autenticado')

      next()
      return
    }
  
    res.redirect('/')
}
function isAuthAdmin(req, res, next) {
    if (req.user.role =='Admin') {
      logger.info('es admin')

      next()
      return
    }
  
    res.redirect('/')
}
function isAuthNotAdmin(req, res, next) {
  if (req.user.role !=='Admin') {
    logger.info('no es admin')

    next()
    return
  }

  res.redirect('/')
}

module.exports = {isAuth, isAuthLogin, isAuthAdmin, isAuthNotAdmin}