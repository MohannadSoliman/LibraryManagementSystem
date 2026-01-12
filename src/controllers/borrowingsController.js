const Borrowing = require('../models/borrowing');
const Book = require('../models/book');
const Borrower = require('../models/borrower');
const { Op } = require('sequelize');

const BorrowingController = {

  // Check out a book
  async checkoutBook(req, res, next) {
    try {
      const { bookId, borrowerId, dueDate } = req.body;

      const book = await Book.findByPk(bookId);
      if (!book) return res.status(404).json({ success: false, error: 'Book not found' });

      const borrower = await Borrower.findByPk(borrowerId);
      if (!borrower) return res.status(404).json({ success: false, error: 'Borrower not found' });

      if (book.available_quantity <= 0) {
        return res.status(400).json({ success: false, error: 'Book is not available' });
      }

      await Borrowing.create({ book_id: bookId, borrower_id: borrowerId, due_date: dueDate });
      await book.decrement('available_quantity', { by: 1 });

      res.json({ success: true });
    } catch (err) {
      err.message = `Book checkout failed: ${err.message}`;
      next(err);
    }
  },

  // Return a book
  async returnBook(req, res, next) {
    try {
      const { bookId, borrowerId } = req.body;
      const borrowing = await Borrowing.findOne({ where: { book_id: bookId, borrower_id: borrowerId, returned: false } });

      if (!borrowing) return res.status(404).json({ success: false, error: 'Borrowing record not found' });

      borrowing.returned = true;
      await borrowing.save();

      const book = await Book.findByPk(bookId);
      await book.increment('available_quantity', { by: 1 });

      res.json({ success: true });
    } catch (err) {
      err.message = `Book return failed: ${err.message}`;
      next(err);
    }
  },

  // List current books borrowed by a borrower
  async listBorrowedBooks(req, res, next) {
    try {
      const { borrowerId } = req.params;
      const borrowedBooks = await Borrowing.findAll({
        where: { borrower_id: borrowerId, returned: false },
        include: [Book],
      });
      res.json({ success: true, borrowedBooks });
    } catch (err) {
      err.message = `Listing borrowed books failed: ${err.message}`;
      next(err);
    }
  },

  // List overdue books
  async listOverdue(req, res, next) {
    try {
      const today = new Date();
      const overdueBooks = await Borrowing.findAll({
        where: { due_date: { [Op.lt]: today }, returned: false },
        include: [Book, Borrower],
      });
      res.json({ success: true, overdueBooks });
    } catch (err) {
      err.message = `Listing overdue books failed: ${err.message}`;
      next(err);
    }
  },
};

module.exports = BorrowingController;
