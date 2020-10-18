const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");

// DB Connection  
const url = 'mongodb://localhost:28000/books';
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });



const app = express();

// passport config
require("./config/passport")(passport);

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Express session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

function auth (req, res, next) {
  console.log(req.session);

  if(!req.session.user) {
      var err = new Error('You are not authenticated!');
      err.status = 403;
      return next(err);
  }
  else {
      if (req.session.user === 'authenticated') {
          next();
      }
      else {
          var err = new Error('You are not authenticated!');
          err.status = 403;
          return next(err);
      }
  }
}

// passport
//app.use(passport.initialize());
//app.use(passport.session());

// Connect flash
//app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);
app.use(auth)
app.use("/users", userRoutes);
app.use("/", bookRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
