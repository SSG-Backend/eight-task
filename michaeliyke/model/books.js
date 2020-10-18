//  mongodb://127.0.0.1:27017/books
const mongoose = require('mongoose');

const {Schema} = mongoose;

const BookSchema = new Schema({
  ebook_path: {
    type: String,
    default: null,
  },
  extensions: {
    type: Array,
    required: true,
    default: []
  },
  title: {
    type: String,
    required: true,
    unique: true
  },
  author: {
    type: String,
    required: true
  },
  isbn: {
    type: Number,
    required: true,
    unique: true
  },
  path: {
    type: String,
    required: true,
    unique: true
  },
  mimetype: {
    type: String,
    default: 'application/pdf'
  },
  date: {
    type: Date,
    default: new Date()
  },
  filename: {
    type: String,
    require: true
  },
  size: {
    type: Number
  }
});



// var Books = mongoose.model('Books', BookSchema);
//  BookModel(details, success, error)
module.exports = function BookCreationModel(details, success, error) {
  const Books = mongoose.model(String("Books"), BookSchema);
  Books.create(details).then(success).catch(error);
};