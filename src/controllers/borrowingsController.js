const Borrowing = require('../models/borrowing');
const Book = require('../models/book');
const Borrower = require('../models/borrower');
const BookController = require('./booksController');
const { Op } = require('sequelize');

const cache = {
  borrowedBooks: {}, // { borrowerId: [...books] }
  overdueBooks: null 
};

const BorrowingController = {

  // Check out books
  async checkoutBooks(req, res, next) {
    try {
        const { borrowerId, books } = req.body;

        const borrower = await Borrower.findByPk(borrowerId);
        if (!borrower) return res.status(404).json({ success: false, error: 'Borrower not found' });

        const results = [];

        for (const { bookId, dueDate } of books) {
            const book = await Book.findByPk(bookId);
            if (!book) {
                results.push({ bookId, success: false, error: 'Book not found' });
                continue;
            }

            if (book.available_quantity <= 0) {
                results.push({ bookId, success: false, error: 'Book not available' });
                continue;
            }

            await Borrowing.create({
                book_id: bookId,
                borrower_id: borrowerId,
                borrowed_date: new Date(),
                due_date: dueDate
            });

            await book.decrement('available_quantity', { by: 1 });
            results.push({ bookId, success: true });
        }

        // Invalidate caches
        cache.borrowedBooks[borrowerId] = null;
        cache.overdueBooks = null;
        BookController.invalidateCache(); // invalidate book caches

        res.json({ success: true, results });
    } catch (err) {
        err.message = `Bulk checkout failed: ${err.message}`;
        next(err);
    }
  },

  // Return multiple books
  async returnBooks(req, res, next) {
    try {
        const { borrowingIds } = req.body;

        if (!Array.isArray(borrowingIds) || borrowingIds.length === 0) {
            return res.status(400).json({ success: false, error: 'No borrowing IDs provided' });
        }

        const results = [];

        for (const id of borrowingIds) {
            const borrowing = await Borrowing.findByPk(id, { include: [Book] });
            if (!borrowing || borrowing.returned_date) {
                results.push({ id, success: false, error: 'Borrowing record not found or already returned' });
                continue;
            }

            borrowing.returned_date = new Date();
            await borrowing.save();

            if (borrowing.Book) {
                await borrowing.Book.increment('available_quantity', { by: 1 });
            }

            results.push({ id, success: true });

            // Invalidate cache for this borrower
            if (cache.borrowedBooks[borrowing.borrower_id]) {
              cache.borrowedBooks[borrowing.borrower_id] = null;
            }
            cache.overdueBooks = null;
            BookController.invalidateCache(); // invalidate book caches
        }

        res.json({ success: true, results });
    } catch (err) {
        err.message = `Bulk return failed: ${err.message}`;
        next(err);
    }
  },

  // List current books borrowed by a borrower (cached)
  async listBorrowedBooks(req, res, next) {
    try {
      const { borrowerId } = req.params;

      if (!cache.borrowedBooks[borrowerId]) {
        const borrowedBooks = await Borrowing.findAll({
          where: { borrower_id: borrowerId, returned_date: null },
          include: [Book],
        });
        cache.borrowedBooks[borrowerId] = borrowedBooks;
      }

      res.json({ success: true, borrowedBooks: cache.borrowedBooks[borrowerId] });
    } catch (err) {
      err.message = `Listing borrowed books failed: ${err.message}`;
      next(err);
    }
  },

  // List overdue books (cached)
  async listOverdue(req, res, next) {
    try {
      const today = new Date();

      if (!cache.overdueBooks) {
        const overdueBooks = await Borrowing.findAll({
          where: { due_date: { [Op.lt]: today }, returned_date: null },
          include: [Book, Borrower],
        });
        cache.overdueBooks = overdueBooks;
      }

      res.json({ success: true, overdueBooks: cache.overdueBooks });
    } catch (err) {
      err.message = `Listing overdue books failed: ${err.message}`;
      next(err);
    }
  },
};

module.exports = BorrowingController;
