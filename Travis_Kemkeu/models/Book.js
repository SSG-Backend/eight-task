const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./User');

const bookSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please supply a name']
    },
    author: {
        type: String,
        required: [true, 'Please supply an author']
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Book', bookSchema);