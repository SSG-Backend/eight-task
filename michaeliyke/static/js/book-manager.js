!(function() {

  const { log } = console;
  const l = log;

  module.exports = {

books: null,

writeBookFile() {
  fs.writeFile(`${__dirname}/public/assets/books.json`,  "UTF8", this.books, (error, data) =>{
    if (error) {
      throw new Error(error);
    }
  });
},

updateBook(bookItem) {
  const book = getBookById(bookItem.id);
  book.author = bookItem.author;
  book["book-title"] = bookItem["book-title"];
  book.ISBN = bookItem.ISBN;
  writeBookFile();
},

createNewBook(bookItem) {
  this.books.push(bookItem);
  writeBookFile();
},

deleteBook(id) { 
  const bookItem = getBookById(id);
  let index = 0;
  for(let book in this.books) {
    if (book.id = bookItem.id) {
      this.books.splice(index, 1, bookItem);
      break;
    }
    index += 1;
  }
  writeBookFile();
},
getLastId() {
  return this.books.length;
},

getBookById(id) {
  let bookItem = {};
  for(book of this.books) {
    if(book.id == id) {
      bookItem = book;
      break;
    }
  }
  return bookItem;
},

getBookByAuthor(author) {
  let bookItem = {};
  for(book of this.books) {
    if(book.author == author) {
      bookItem = book;
      break;
    }
  }
  return bookItem;
},

getBookByISBN(ISBN) {
  let bookItem = {};
  for(book of this.books) {
    if(book.ISBN == ISBN) {
      bookItem = book;
      break;
    }
  }
  return bookItem;
}
};


}());