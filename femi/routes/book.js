const express = require("express");
const router = express.Router();

const BookController = require("../controllers/bookController");

const ensureAuthenticated = require("../config/auth");

// show welcome page
router.get("/", BookController.showWelcome);

// show dashboard when logged in
router.get("/dashboard", ensureAuthenticated, BookController.showDashboard);

// get a book by id
router.get("/book/:id", ensureAuthenticated, BookController.getBook);

// post a book
router.post("/book", ensureAuthenticated, BookController.postBook);

// update a book
router.put("/book/:id", ensureAuthenticated, BookController.updateBook);

// delete a book
router.delete("/book/:id", ensureAuthenticated, BookController.deleteBook);

module.exports = router;