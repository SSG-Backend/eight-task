var mongoose = require('mongoose');
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
var mongoURI = require('../config/keys').MongoURI;

// Connect to DB
mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});

const connection = mongoose.connection;



module.exports = { conn: connection };