// HAND WRITTEN LOCAL STRATEGY FOR PASSPORT. PASSPORT DOESNT HAVE A LOCAL STRAT YOU MUST CREATE ONE.
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load Users model (database structure)
const User = mongoose.model('users');

// export function, //define the local strategy being used in app.js
module.exports = function (passport) { // pass in passport from app.js
  passport.use(new localStrategy({ usernameField: 'email' }, (email, password, done) => { // inside function called "done"
    // match user
    User.findOne({
      email: email // find email passed in
    }).then(user => {
      if (!user) { // if user not found with that email address
        return done(null, false, { message: 'No user found' }) // params is error, user, msg
      }

      // match passsword
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) { // if password matched return the user from the db
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password incorrect' });
          req.flash('error_msg', 'Password incorrect');
        }
      }) // user is coming from the promise. if its found a user, its found a password for the user as well. Now compare the hashed password to the non hashed password.

    })
  }));

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    })
  })



}