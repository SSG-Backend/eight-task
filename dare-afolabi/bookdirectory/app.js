var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');

const crypto = require("crypto");

const passport = require('passport');

var mongoose = require('mongoose');
const multer = require("multer");
var db = require('./config/keys').MongoURI;
const conn = require('./config/db-storage');


var indexRouter = require('./routes/index');
var bookRouter = require('./routes/book');
var userRouter = require('./routes/users');

var app = express();


//Passport config
require('./config/passport')(passport);

/* // Connect to DB
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('MongoDb Connected...'))
.catch(err => console.log(err));
 */


// app.use(upload);


// view engine setup
app.use(expressLayouts);
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(session({
  secret: 'digbanko',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Connect flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/book', bookRouter);
app.use('/users', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  console.log(err);
  res.status(err.status || 500);
  res.json({error: 'There was an error.'});
});

module.exports = app;
