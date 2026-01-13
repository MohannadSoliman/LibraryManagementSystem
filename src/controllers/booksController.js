const Book = require('../models/book');
const { Op } = require('sequelize');

// Simple in-memory cache
let booksCache = null;          // full book list cache
let searchCache = {};           // search query cache

const BookController = {

  // Add a book
  async addBook(req, res, next) {
    try {
      const { title, author, isbn, available_quantity, shelf_location } = req.body;
      const newBook = await Book.create({ title, author, isbn, available_quantity, shelf_location });

      // Invalidate caches
      BookController.invalidateCache();

      res.json({ success: true, book: newBook });
    } catch (err) {
      err.message = `Book addition failed: ${err.message}`;
      next(err);
    }
  },

  // Update a book
  async updateBook(req, res, next) {
    try {
      const { id } = req.params;
      const { title, author, isbn, available_quantity, shelf_location } = req.body;
      const book = await Book.findByPk(id);
      if (!book) return res.status(404).json({ success: false, error: 'Book not found' });

      await book.update({ title, author, isbn, available_quantity, shelf_location });

      // Invalidate caches
      BookController.invalidateCache();

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

      // Invalidate caches
      BookController.invalidateCache();

      res.json({ success: true });
    } catch (err) {
      err.message = `Book deletion failed: ${err.message}`;
      next(err);
    }
  },

  // List all books (cached)
  async listBooks(req, res, next) {
    try {
      if (!booksCache) {
        const books = await Book.findAll();
        booksCache = books; // cache full list
      }
      res.json({ success: true, books: booksCache, cached: true });
    } catch (err) {
      err.message = `Listing books failed: ${err.message}`;
      next(err);
    }
  },

  // Search books by title, author, or ISBN (cached per query)
  async searchBooks(req, res, next) {
    try {
      const { query } = req.query;
      const key = query?.trim().toLowerCase() || 'all';

      if (searchCache[key]) {
        return res.json({ success: true, books: searchCache[key], cached: true });
      }

      const books = await Book.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${query}%` } },
            { author: { [Op.like]: `%${query}%` } },
            { isbn: { [Op.like]: `%${query}%` } },
          ],
        },
      });

      // Cache this search
      searchCache[key] = books;

      res.json({ success: true, books, cached: false });
    } catch (err) {
      err.message = `Book search failed: ${err.message}`;
      next(err);
    }
  },

  // Expose cache invalidation method
  invalidateCache() {
    booksCache = null;
    searchCache = {};
  },
};

module.exports = BookController;
