var express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
// var users = require('../modules/users.js');
const User = require('../models/User');

var router = express.Router();



//Login Page
router.get('/login', function(req, res) {
  res.render('login');
});

//Register Page
router.get('/register', function(req, res) {
  res.render('register');
});

//Registeration Handler
router.post('/register', function(req, res) {
  // res.send(req.body);
  const { name, email, password, password2 } = req.body;
  let errors = [];


  if(!name || !email || !password || !password2){
    errors.push({msg: 'Please fill in all fields'});
  }


  if(password !== password2){
    errors.push({msg: 'Passwords do not match'});
  }


  if(password.length < 8){
    errors.push({msg: 'Password should be at least 8 characters'});
  }


  if(errors.length > 0){
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // Validation passed
    User.findOne({ email: email })
    .then(user => {
      if(user) {
        // User exists
        errors.push({msg: 'Email is already registered'});
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        // Hash password
        bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, 
          (err, hash) => {
            if(err) throw err;
            // Set password to hashed
            newUser.password = hash;
            //Save user
            newUser.save()
            .then(user => {
              req.flash('success_msg', 'You are now registered and can log in');
              res.redirect('/users/login');
            })
            .catch(err => console.log(err));
          }))

      }
    });
  }



});


//Login Handler
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});


//Logout Handle
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});


module.exports = router;

