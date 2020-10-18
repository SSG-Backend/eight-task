(function() {
  const express = require("express");
  const mongoose = require("mongoose");
  const session = require("express-session");
  const MongoStore = require("connect-mongo")(session);
  const path = require("path");
  const multer = require("multer");
  const app = express();
  const BookCreationModel = require("./model/books");
  const {log} = console;
  const l = log;

  const TWO_HOURS = (1000 * 60 * 60) * 2;

  // Use asigned defualts if not found in the process.env object
  const {HOST = "127.0.0.1", PORT = 1200, SESSION_NAME = "sid", SESSION_SECRETE = "ssh!quiet,it\'asecret", SESSION_LIFETIME = TWO_HOURS, NODE_ENV = "development"} = process.env

  const IN_PROD = NODE_ENV === "production";

  mongoose.connect("mongodb://localhost/directory", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });

  const db = mongoose.connection;

  db.on("error", () => console.log("Error occured"));
  db.once("open", () => console.log("You're in!"));

  // app.use("/", routes);

  app.use(session({
    name: SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESSION_SECRETE,
    cookie: {
      maxAge: SESSION_LIFETIME,
      sameSite: true,
      secure: IN_PROD
    },
    store: new MongoStore({
      mongooseConnection: db
    })
  }));

  const upload = multer({
    dest: "uploads/"
  });

  app.use(express.static("static"));

  app.get("/", (request, response, next) => {
    response.setHeader("Content-Type", "text/html");
    request.statusCode = 200;
    response.sendFile(path.join(`${__dirname}/static/DnD.html`));
  });

  app.post("/upload-target", upload.single("book"), (request, response, next) => {

    console.log("body: \n", request.body);
    console.log("file: \n", request.file);

    if (request.body.title && request.body.author) {

      const details = {
        title: request.body.title,
        author: request.body.author,
        id: 0,
        path: request.file.path,
        isbn: Math.floor(Math.random() * 10000000000000),
        date: new Date(),
        mimetype: request.file.mimetype,
        filename: request.file.filename,
        size: request.file.size,
      };
      let bk;
      BookCreationModel(details, function(book) {
        l("Book created: \n ", book);
        response.statusCode = 200;
        bk = book;
        response.send(book);
      }, function(error) {
        log("WHOOPS!: \n", error);
        next(error);
      });
    // response.end("Thanks for submitting your details");
    } else {
      return response.redirect("/");
    }
  });


  app.listen(PORT, HOST, (error) => {
    if (error) {
      console.error(error);
    }
    console.info(`Server listen on ${HOST}/${PORT}`);
  });

  function mediator(request, response, next) {
    // response.end("Mediator ended call!");
    next();
  }

  function props(O) {
    let _props = [],
      prop;
    for (prop in O) {
      _props.push(prop);
      return _props;
    }
  }

}());