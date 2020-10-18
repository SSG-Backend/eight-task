const mongoose = require('mongoose');
const BookSchema = new mongoose.Schema({
    isbn: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    pages: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    ebook: {
        data: Buffer,
        contentType: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;

