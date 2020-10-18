const express = require("express");
const router = express.Router();

const BookController = require("../controllers/bookController");

const ensureAuthenticated = require("../config/auth");

const upload = require("../middleware/upload");

// show welcome page
router.get("/", upload, BookController.showWelcome);

// show dashboard when logged in
router.get("/dashboard", ensureAuthenticated, BookController.showDashboard);

// get a book by id
router.get("/books/:id", ensureAuthenticated, BookController.getBook);

// post a book
router.post("/books", ensureAuthenticated, upload, BookController.postBook);

// update a book
router.put("/books/:id", ensureAuthenticated, BookController.updateBook);

// delete a book
router.delete("/books/:id", ensureAuthenticated, BookController.deleteBook);

module.exports = router;
