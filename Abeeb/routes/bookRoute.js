// Require modules
const express = require("express");
const bookController = require("../controllers/bookController");

const router = express.Router();

// Read or get book(s)
router
  .route("/")
  .post(bookController.createBook)
  .get(bookController.getAllBooks);

// Read with id, update and delete
router
  .route("/:id")
  .get(bookController.getBook)
  .patch(bookController.updateBook)
  .delete(bookController.deleteBook);

// Export module
module.exports = router;
