const dotenv = require('dotenv').config(); // set enviroment processes
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const app = express();

// Load routes
const blogs = require('./routes/blogs');
const users = require('./routes/users');


// Passport config
require('./config/passport')(passport); // passing passport into the config thats exported. To be used.

//DB config
const db = require('./config/database');

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect(db.mongoURI, {
  useMongoClient: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware

app.use(bodyParser.urlencoded({limit: '10mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

// Express session midleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables can be used in any file or template
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null; // allows access to the user in the Users db.
  next();
});


// Index Route
app.get('/', (req, res) => {

  res.render('index')

});

app.get('/about', (req, res) => {
  res.render('about');
})



// Use routes
app.use('/blogs', blogs);
app.use('/users', users);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});