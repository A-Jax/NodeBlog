const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth'); // include the auth.js into the ideas.js file.

// Load Blogs Model
require('../models/Blogs');
const Blogs = mongoose.model('blogs');

// Blogs Index Page
router.get('/', (req, res) => {
  Blogs.find({})
    .sort({date:'desc'})
    .then(Blogs => {
      res.render('blogs/index', {
        blogs:Blogs
      });
    });
});

// Add Blog Form
router.get('/add', ensureAuthenticated, (req, res) => { // ensureAuthenticated requires you to be logged in as a user in the database to go to this route. If you are not, it will throw an error message and redirect you.
  res.render('blogs/add');
});

// Edit Blog Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Blogs.findOne({
    _id: req.params.id
  })
  .then(blogs => {
    res.render('blogs/edit', {
      blogs:blogs
    });
  });
});

// add blog post
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = [];

  if(!req.body.title){
    errors.push({text:'Please add a title'});
  }
  if(!req.body.details){
    errors.push({text:'Please add some details'});
  }

  if(errors.length > 0){
    res.render('/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details,
      date: Date.now()
    });
  } else {

    const newUser = {
      title: req.body.title,
      details: req.body.details,
      date: Date.now()
    }
    new Blogs(newUser)
      .save()
      .then(blog => {
        req.flash('success_msg', 'Video idea added');
        res.redirect('/blogs');
      })
  }
});

// Edit Form process
router.put('/:id', ensureAuthenticated, (req, res) => {
  Blogs.findOne({
    _id: req.params.id
  })
  .then(blog => {
    // new values
    blog.title = req.body.title;
    blog.details = req.body.details;

    blog.save()
      .then(blogs => {
        req.flash('success_msg', 'Blog Post updated');
        res.redirect('/blogs');
      })
  });
});

// Delete Blog
router.delete('/:id', ensureAuthenticated, (req, res) => {

let input = req.body.deleteAuth;

  Blogs.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Blog Post removed');
      res.redirect('/blogs');
    });
});


module.exports = router;