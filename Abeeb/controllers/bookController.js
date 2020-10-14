const fs = require("fs");

const APIFeatures = require("../utils/apiFeatures");
const Book = require("../models/bookModel");

// const books = JSON.parse(fs.readFileSync("data.json", "utf-8"));

// Get all books
exports.getAllBooks = async (req, res) => {
  const features = new APIFeatures(Book.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const books = await features.query;

  res.status(200).json({
    status: "success",
    results: books.length,
    data: {
      books,
    },
  });
};

// Get single book with id
exports.getBook = async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return next(Error("No book found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      book,
    },
  });
};

// Create new book
exports.createBook = async (req, res) => {
  const newBook = await Book.create(req.body);

  res.status(201).json({
    status: "success",
    message: "New book created",
    data: {
      book: newBook,
    },
  });
};

// Update single book
exports.updateBook = async (req, res, next) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // If no book object ID
  if (!book) {
    return next(Error("No book found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Book updated",
    book,
  });
};

// Delete book
exports.deleteBook = async (req, res, next) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  // If not found
  if (!book) {
    return next(Error("No book found"));
  }

  res.status(200).json({
    status: "success",
    message: "Book deleted",
    data: null,
  });
};
