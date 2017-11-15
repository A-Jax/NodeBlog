module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if(req.isAuthenticated()) { // isAuthenticated is a passport function built in. Just call it.
      return next(); // call the next middle ware or function 
    }
    req.flash('error_msg', 'You need to log in');
    res.redirect('/users/login');
  }
}