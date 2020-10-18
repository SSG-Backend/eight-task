var express = require('express');
const crypto = require("crypto");
const path = require("path");
const fs = require('fs');
const mongoose = require("mongoose");
const multer = require("multer");

var multiparty = require('multiparty');

var mongoURI = require('../config/keys').MongoURI;
const {conn, gfs} = require('../config/db-storage');

var books = require('../modules/books.js');
const Book = require('../models/Book');

var router = express.Router();
// const { ensureAuthenticated } = require('../config/auth');


// GET book listing.
router.get('/', function(req, res) {
  // var allBooks = books.getBooks();
  // res.json(allBooks.books);
  Book.find({}, (error, result) => {
    if (error) {
      console.error(error);
      return null;
    }
    if (result != null) {
      // res.json(result);
      res.render('book-dashboard', {books: result});
    } else {
      res.json({});
    }
  });
});


// GET book upload form.
router.get('/upload', function(req, res) {
  res.render('upload-book');
});



// GET book upload form.
router.post('/upload', function(req, res) {

  console.log(req.body);
  // console.log(req.file);
  // console.log(req.files);

// const form = new multiparty.Form()
// form.parse(req, (err, fields, files) => {
//   if(err) return res.status(500).send({ error: err.message });
//   console.log('field data: ', fields);
//   console.log('files: ', files);
// });


const form = new multiparty.Form({ uploadDir: './uploads/' })
form.parse(req, (err, fields, files) => {
  if(err) return res.status(500).send({ error: err.message });
  // console.log('field data: ', fields);
  // console.log('files: ', files);

  console.log(fields);
  console.log(files);

  let isbn = fields.isbn[0];
  let title = fields.title[0];
  let category = fields.category[0];
  let author = fields.author[0];
  let publisher = fields.publisher[0];
  let pages = fields.pages[0];
  let year = fields.year[0];
  let filename = fields.filename[0];

  console.log(files.file);


  if(!isbn || !title || !category || !author || !publisher || !pages || !year){
    res.end('All fields are compulsory');
  } else {
    let newBook = new Book({
      isbn,
      title,
      category,
      author,
      publisher,
      pages,
      year
    });

    // newBook.ebook.data = fs.readFileSync(files.file[0][0].path);
    // newBook.ebook.contentType = 'application/pdf';

    // Save Book
    newBook.save();
    
  }
  
});

  res.redirect('/book');            
});



// GET a book.
router.get('/:bookIsbn', function(req, res, next) {
  // var theBook = books.findBook(req.params.bookIsbn);
  // if (theBook === undefined) {
  //   res.writeHead(404, {'Content-Type' : 'text/plain'});
  //   res.end('Not found');
  // } else {
  //   res.json(theBook);
  // }


  Book.findOne({isbn: req.params.bookIsbn}, function(error, result) {
    if (error) {
      console.error(error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return;
    } else {
        if (!result) {
          if (res != null) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
          }
          return;
        }
        if (res != null) {
          res.setHeader('Content-Type', 'application/json');
          res.send(result);
        }
          console.log(result);
      }
    });



});


/* // POST(Add) a book.
router.post('/', function(req, res) {
  
  // var obj = {
  //   title: req.body.title,
  //   category: req.body.category,
  //   author: req.body.author,
  //   publisher: req.body.publisher,
  //   year: req.body.year,
  //   pages: req.body.pages,
  //   isbn: req.body.isbn
  // };
  // books.addBook(obj);
  // res.json({"addedBook": obj});
  const { isbn, title, category, author, publisher, pages, year } = req.body;
  if(!isbn || !title || !category || !author || !publisher || !pages || !year){
    res.end('All fields are compulsory');
  } else {
    const newBook = new Book({
      isbn,
      title,
      category,
      author,
      publisher,
      pages,
      year
    });

    // Save Book
    newBook.save()
            .then(book => {
              res.json({"addedBook": book});
            })
            .catch(err => console.log(err));
  }
}); */


// UPDATE(Modify) a book.
router.put('/', function(req, res) {
  // var obj = {
  //   title: req.body.title,
  //   category: req.body.category,
  //   author: req.body.author,
  //   publisher: req.body.publisher,
  //   year: req.body.year,
  //   pages: req.body.pages,
  //   isbn: req.body.isbn
  // };
  // var toRedirect = books.updateBook(obj);
  // if (toRedirect) {
  //   res.send("Book can't be modified because it doesn't exist.");
  // } else if(toRedirect === false) {
  //   res.json({"updatedBook": obj});
  // } else {
  //   res.send('Directory is empty');
  // }

  const { isbn, title, category, author, publisher, pages, year } = req.body;

  if(!isbn || !title || !category || !author || !publisher || !pages || !year){
    res.end('All fields are compulsory');
  } else {
    var newBook = new Book({
      isbn,
      title,
      category,
      author,
      publisher,
      pages,
      year
    });
  }


  Book.findOne({isbn: req.body.isbn}, function(error, result) {
    if (error) {
      console.error(error);
      // res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.send(error);
    } else {
        if (!result) {
          console.log('Item does not exist. Creating a new one');
          newBook.save()
            .then(book => {
              // res.writeHead(201, { 'Content-Type': 'application/json' });
              // res.end(JSON.stringify(req.body));
              res.json({"addedBook": book});
            })
            .catch(err => console.log(err));
        } else {
          console.log('Updating existing item');
          result.isbn = newBook.isbn;
          result.title = newBook.title;
          result.category = newBook.category;
          result.author = newBook.author;
          result.publisher = newBook.publisher;
          result.pages = newBook.pages;
          result.year = newBook.year;

          Book.findOneAndUpdate({ isbn: req.body.isbn }, result, { new: true, useFindAndModify: false }, function(err, result) {
            if (err) {
              res.send(err);
            } else {
              res.json(result);
            }
          });

        }
      }
    });

});

// DELETE(Remove) a book.
router.delete('/:bookIsbn', function(req, res, next) {
  // var theBook = books.removeBook(req.params.bookIsbn);
  // if (theBook === undefined) {
  //   res.writeHead(404, {'Content-Type' : 'text/plain'});
  //   res.end('Not found');
  // } else {
  //   res.json({"removedBook": theBook});
  // }


  Book.deleteOne({ isbn: req.params.bookIsbn }, function(err, result) {
    if (err) {
      res.send(err);
    } else if (result.ok === 1 && result.deletedCount === 1) {
      console.log(result);
      res.send('Successful deletion');
    } else {
      console.log(result);
      res.send('Unsuccessful deletion');
    }
  });




});

module.exports = router;

