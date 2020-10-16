const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          // Match user
          const findUser = await User.findOne({ email: email });
          if (!findUser) {
            return done(null, false, {
              message: "That email is not registered",
            });
          }

          // Match password
          const rightPassword = await bcrypt.compare(
            password,
            findUser.password
          );
          if (!rightPassword) {
            return done(null, false, { message: "Password incorrect" });
          }

          return done(null, findUser);
        } catch (err) {
          console.log(err);
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
