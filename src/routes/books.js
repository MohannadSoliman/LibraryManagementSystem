const express = require('express');
const BookController = require('../controllers/booksController');
const { bookValidationRules, validate } = require('../middlewares/validateInput');
const { readRateLimiter, writeRateLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

router.post('/', writeRateLimiter, bookValidationRules.add, validate, BookController.addBook);

router.put('/:id', bookValidationRules.update, validate, BookController.updateBook);

router.delete('/:id', bookValidationRules.delete, validate, BookController.deleteBook);

router.get('/', readRateLimiter, BookController.listBooks);

router.get('/search', readRateLimiter, bookValidationRules.search, validate, BookController.searchBooks);

module.exports = router;
