// Require modules
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");

const bookRouter = require("./routes/bookRoute");
const userRouter = require("./routes/userRoute");

// Execute express
const app = express();

// Read config file
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful"));

// Middlewares
app.use(express.json());
app.use(express.static(`${__dirname}/views`));
app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// route middleware
app.use("/api/v1/books", bookRouter);
app.use("/user", userRouter);

// Home route
app.get("/", (req, res) => {
  res.render("index", {
    title: "Welcome to BookStore",
  });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/all-books", (req, res) => {
  res.render("allbooks");
});

app.get("/add-book", (req, res) => {
  res.render("addbook");
});

// All possible middleware error
app.all("*", (req, res, next) => {
  next(Error(`Could not find ${req.originalUrl} on the server!`));
});

// start server
const port = 5000;
app.listen(port, () => console.log(`App running on port ${port}`));
