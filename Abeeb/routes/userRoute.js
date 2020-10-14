// Require modules
const express = require("express");
const bcrypt = require("bcryptjs");
const validationErrors = require("express-validator");

const User = require("../models/userModel");

const router = express.Router();

// signup form
router.get("/register", (req, res) => {
  res.render("register");
});

// signup functionality
router.post("/register", (req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const password = req.body.password;
  const confirmpassword = req.body.confirmpassword;

  let errors = req.validationErrors();

  if (errors) {
    res.render("register", {
      errors,
    });
  } else {
    let newUser = new User({
      firstname,
      lastname,
      email,
      password,
    });

    bcrypt.getSalt(10, function (err, salt) {
      bcrypt.hash(newUser.password, salt, function (err, hash) {
        if (error) {
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function (err) {
          if (error) {
            console.log(err);
            return;
          } else {
            req.flash("success", "Registration successful. You can log in");
            res.redirect("/user/login");
          }
        });
      });
    });
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  //
});

// Export module
module.exports = router;
