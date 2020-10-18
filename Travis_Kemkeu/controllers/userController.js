const User = require("../models/User");
const bcrypt = require('bcryptjs');
const passport = require('passport');

class UserController {
  static async showLogin(req, res, next) {
    res.render("login");
  }

  static async showRegister(req, res, next) {
    res.render("register");
  }

  static async handleRegister(req, res, next) {
    let { name, email, password, password2 } = req.body;

    let errors = [];

    try {  
      // check required fields
      if (!name || !email || !password || !password2) {
        errors.push({ msg: "Please fill in all fields" });
      }

      // check if passwords match
      if (password !== password2) {
        errors.push({ msg: "Passwords do no match" });
      }

      // check password length
      if (password.length < 6) {
        errors.push({ msg: "Password should be at least 6 characters" });
      }

      if (errors.length > 0) {
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        // validation passed
        let userExists = await User.findOne({ email: email });
        if (userExists) {
          errors.push({ msg: "Email is already registered" });
          return res.render("register", {
            errors,
            name,
            email,
            password,
            password2,
          });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        password = hashedPassword;

        const newUser = {
          name, email, password
        };

        const savedUser = await User.create(newUser);

        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('/users/login');
      }
    } catch (err) {
      console.log(err);
      errors.push({ msg: "Something went wrong. Please try again" });
    }
  }

  static async handleLogin(req, res, next) {
    passport.authenticate(
      'local',
      {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
      }
    )(req, res, next);
  }

  static async handleLogout(req, res, next) {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  }
}

module.exports = UserController;
