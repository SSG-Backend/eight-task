const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    require: [true, "Book title is required"],
  },
  publisher: {
    type: String,
    require: [true, "Book publisher is required"],
  },
  year: {
    type: String,
    require: [true, "Book year is required"],
  },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
