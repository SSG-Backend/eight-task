var fs = require('fs');

var readDirectorySync = function() {
    var file = './data/directory.json';
    if (fs.existsSync(file)) {
      var content = fs.readFileSync(file, "utf-8");
      var directory = JSON.parse(content);
      return directory;
    } else {
        return undefined;
    }
  };


var writeDirectorySync = function(directory) {
    var file = './data/directory.json';
    fs.writeFileSync(file, JSON.stringify(directory));
};


module.exports.getBooks = function() {
    var bookList = readDirectorySync();
    return bookList;
};


module.exports.findBook = function(bookIsbn) {
    console.log('Looking for item with ISBN' + bookIsbn);
    var directory = readDirectorySync();
    if (directory) {
        for (var bookIndex in directory.books) {
            // console.log(typeof bookId);
            // console.log(typeof directory.books[bookIndex].bookId);
            if (directory.books[bookIndex].isbn === bookIsbn) {
                return directory.books[bookIndex];
            } 
        }
    } else {
        return undefined;
    }
};


module.exports.addBook = function(newBook) {
    var directory = readDirectorySync();
    directory.books.push(newBook);
    writeDirectorySync(directory);
};


module.exports.updateBook = function(modifiedBook) {
    var directory = readDirectorySync();
    
    if (directory) {
        if (directory.books.some(eachBook => eachBook.isbn === modifiedBook.isbn)) {
            for (var bookIndex in directory.books) {
                if (directory.books[bookIndex].isbn === modifiedBook.isbn) {
                    directory.books[bookIndex] = modifiedBook;
                } 
            }
            writeDirectorySync(directory);
            return false;
    
        } else {
            return true;
        }
    } else {
        return undefined;
    }
        
    
};


module.exports.removeBook = function(bookIsbn) {
    console.log('Looking for item with ISBN' + bookIsbn);
    var directory = readDirectorySync();
    if (directory) {
        for (var bookIndex in directory.books) {
            if (directory.books[bookIndex].isbn === bookIsbn) {
                
                var removedBook = directory.books.splice(bookIndex, 1);
                writeDirectorySync(directory);
                return removedBook;
            } 
        }
    } else {
        return undefined;
    }
};

