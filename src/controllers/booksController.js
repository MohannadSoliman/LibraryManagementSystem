const Book = require('../models/book');
const { Op } = require('sequelize');

const BookController = {

  // Add a book
  async addBook(req, res, next) {
    try {
      const { title, author, isbn, available_quantity, shelf_location } = req.body;
      const newBook = await Book.create({ title, author, isbn, available_quantity, shelf_location });
      res.json({ success: true, book: newBook });
    } catch (err) {
      err.message = `Book addition failed: ${err.message}`;
      next(err);
    }
  },

  // Update a bookbooks
  async updateBook(req, res, next) {
    try {
      const { id } = req.params;
      const { title, author, isbn, available_quantity, shelf_location } = req.body;
      const book = await Book.findByPk(id);
      if (!book) return res.status(404).json({ success: false, error: 'Book not found' });

      await book.update({ title, author, isbn, available_quantity, shelf_location });
      res.json({ success: true, book });
    } catch (err) {
      err.message = `Book update failed: ${err.message}`;
      next(err);
    }
  },

  // Delete a book
  async deleteBook(req, res, next) {
    try {
      const { id } = req.params;
      const book = await Book.findByPk(id);
      if (!book) return res.status(404).json({ success: false, error: 'Book not found' });

      await book.destroy();
      res.json({ success: true });
    } catch (err) {
      err.message = `Book deletion failed: ${err.message}`;
      next(err);
    }
  },

  // List all books
  async listBooks(req, res, next) {
    try {
      const books = await Book.findAll();
      res.json({ success: true, books });
    } catch (err) {
      err.message = `Listing books failed: ${err.message}`;
      next(err);
    }
  },

  // Search books by title, author, or ISBN
  async searchBooks(req, res, next) {
    try {
      const { query } = req.query;
      const books = await Book.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${query}%` } },
            { author: { [Op.like]: `%${query}%` } },
            { isbn: { [Op.like]: `%${query}%` } },
          ],
        },
      });
      res.json({ success: true, books });
    } catch (err) {
      err.message = `Book search failed: ${err.message}`;
      next(err);
    }
  },
};

module.exports = BookController;
