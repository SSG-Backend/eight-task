const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Book = require('./Book');

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please supply a name']
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, 'Please supply an email address']
    },
    password: {
        type: String,
        required: [true, 'Please supply a password'],
        minLength: 6
    },
    books: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
    date: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('User', userSchema);