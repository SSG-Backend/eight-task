const Book = require("../model/Book");
const User = require("../model/User");

class BookController {
  static async showWelcome(req, res, next) {
    try {
      res.render("welcome");
    } catch (err) {
        console.log(err);
      res.render('server-error');
    }
  }

  static async showDashboard(req, res, next) {
    try {
      const getBooks = await Book.find({})
        .populate("creator")
        .sort({ date: -1 });

      // console.log(getBooks);
      res.render("dashboard", {
        name: req.user.name,
        books: getBooks,
      });
    } catch (err) {
      console.log(err);
      res.render('server-error');
    }
  }

  static async postBook(req, res, next) {
    let { name, author } = req.body;
    let errors = [];

    try {
      if (!name || !author) {
        errors.push({ msg: "Please fill in all fields" });
      }

      if (errors.length > 0) {
        return res.render("dashboard", {
          errors,
          name,
          author,
        });
      }

      let newBook = {
        name,
        author,
        creator: req.user.id,
      };


      Book.create(newBook)
        .then(saveBook => {
          User.findOneAndUpdate(
            { _id: req.user.id },
            { $push: { books: saveBook._id  } },
            {
              new: true,
              runValidators: true,
            }
          ).then(updatedUser => {
            req.flash("success_msg", "Book posted successfully");
            res.redirect("/dashboard")
          })
        })


    } catch (err) {
      console.log(err);
      errors.push({ msg: "Something went wrong. Please try again" });
    }
  }

  static async getBook(req, res, next) {
    try {
      let id = req.params.id;

      let errors = [];

      const getBook = await Book.findOne({ _id: id }).populate("creator");
     

      if (!getBook) {
        res.render('error');
      }

      if (
        JSON.stringify(getBook.creator._id) !== JSON.stringify(req.user._id)
      ) {
        req.flash(
          "error_msg",
          "Book can only be accessed by the creator of the book"
        );
        res.redirect("/dashboard");
      }

      res.render("book", {
        book: getBook,
      });
    } catch (err) {
      console.log(err);
      res.render('server-error');
    }
  }

  static async updateBook(req, res, next) {
    let id = req.params.id;
    let { name, author } = req.body;

    let errors = [];

    try {
      const getBook = await Book.findOne({ _id: id }).populate("creator");
      

      if (!getBook) {
        res.render('error');
      }

      if (
        JSON.stringify(getBook.creator._id) !== JSON.stringify(req.user._id)
      ) {
        req.flash(
          "error_msg",
          "Book can only be accessed by the creator of the book"
        );
        res.redirect("/dashboard");
      }

      let newBook = {
        name,
        author,
        creator: getBook.creator._id,
      };

      const updateBook = await Book.findOneAndUpdate({ _id: id }, newBook, {
        new: true,
        runValidators: true,
      });

      req.flash('success_msg', 'Book updated successfully');
        res.redirect('/dashboard');
    } catch (err) {
      console.log(err);
      res.render('server-error');
    }
  }

  static async deleteBook(req, res, next) {
    let id = req.params.id;

    let errors = [];

    try {
      const getBook = await Book.findOne({ _id: id }).populate("creator");
    

      if (!getBook) {
        res.render('error');
      }

      if (
        JSON.stringify(getBook.creator._id) !== JSON.stringify(req.user._id)
      ) {
        req.flash(
          "error_msg",
          "Book can only be accessed by the creator of the book"
        );
        res.redirect("/dashboard");
      }

      const deleteBook = await Book.remove({ _id: id });
      res.redirect("/dashboard");
    } catch (err) {
        console.log(err);
        res.render('server-error');
    }
  }
}

module.exports = BookController;