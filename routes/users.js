const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth'); // include the auth.js into the ideas.js file.

// Load user model (the database object users)
require('../models/User'); // require it
const User = mongoose.model('users'); // assign it to a local variable called User

// const admin = new User({
//   name: "testAdmin",
//   email: "example@gmail.com",
//   password: "admin"
// });

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(admin.password, salt, (err, hash) => {
//     if (err) throw err;
//     admin.password = hash; // set password to the hash password generated by bcrypt.
//     admin.save() // Save new user to the database with mongoose .save() function.
//   })

// });

// User Login Route
router.get('/login', (req, res) => {
  res.render('users/login');
});


// User Register Route
router.get('/register',  (req, res) => {
  res.render('users/register');

});

// User login form POST
router.post("/login", (req, res, next) => {
  passport.authenticate('local', { // use passport local strategy. Instead of google auth etc.
    successRedirect: "/blogs",
    failureRedirect: '/users/login',
    failureFlash: true // show flash message if you fail login
  })(req, res, next);
});

// Register Form POST
router.post('/register', (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({ text: 'Passwords do not match' });
  }

  if (req.body.password.length < 4) {
    errors.push({ text: 'Password must be at least 4 characters' });
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({ email: req.body.email }) // search User database for the email entered
      .then(user => { // if email already exists.
        if (user) {
          req.flash('error_msg', 'Email in use')
        }
        else {
          const newUser = new User({ // add new users to database
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.admin
          });

          // Encrypt password with Bcrypt
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash; // set password to the hash password generated by bcrypt.
              newUser.save() // Save new user to the database with mongoose .save() function.
                .then(user => {
                  req.flash('success_msg', 'You are now Registered');
                  res.redirect('/users/login');
                })
            })

          });

        }
      })
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout(); // passport js function to log out
  req.flash('success_msg', 'You are now logged out');
  res.redirect('/');
})

module.exports = router;