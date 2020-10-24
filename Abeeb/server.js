// Require modules
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
const flash = require("connect-flash");
const session = require("express-session");

const bookRouter = require("./routes/bookRoute");
const homeRouter = require("./routes/homeRoute");
const userRouter = require("./routes/userRoute");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION! 💥️ Shutting down application..........");
  process.exit(1);
});

const app = express();
dotenv.config({ path: "./config.env" });

// Replace the DB password
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

// Connect to the DB
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful"))
  .catch((err) => console.log(err));

app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

app.use(express.static(`${__dirname}/views`));
app.use(morgan("dev"));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use("/api/v1/books", bookRouter);
app.use("/", homeRouter);
app.use("/users", userRouter);

// app.get("/all-books", (req, res) => {
//   res.render("allbooks", {
//     title: "Available books in store",
//   });
// });

// app.get("/add-book", (req, res) => {
//   res.render("addbook", {
//     title: "All Books",
//   });
// });

// All possible middleware error
app.all("*", (req, res, next) => {
  next(Error(`Could not find ${req.originalUrl} on the server!`));
});

// start server
const port = 5000;
app.listen(port, () => console.log(`App running on port ${port}`));

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLER REJECTION! 💥️ Shutting down application..........");
  server.close(() => {
    process.exit(1);
  });
});
