// Require modules
const express = require("express");
// const passport = require("passport");
const bcrypt = require("bcryptjs");

// User model
const User = require("../models/userModel");

const router = express.Router();

// Login Page
router.get("/login", (req, res) => {
  res.status(200).render("login");
});

// Register Page
router.get("/register", (req, res) => {
  res.status(200).render("register");
});

// Register function
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  let errors = [];

  // Require all fields
  if (!name || !email || !password) {
    errors.push({ msg: "All fields are required" });
  }

  // Check if password matches
  // if (password !== password2) {
  //   errors.push({ msg: "Passwords do not match" });
  // }

  // Password length
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
    });
  } else {
    // find user by email
    User.findOne({ email }).then((user) => {
      // user found
      if (user) {
        errors.push({ msg: "Email already registered." });
        res.render("register", {
          errors,
          name,
          email,
          password,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        // Hash Password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can now log in"
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

module.exports = router;
