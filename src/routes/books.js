const express = require('express');
const BookController = require('../controllers/booksController');
const { bookValidationRules, validate } = require('../middlewares/validateInput');

const router = express.Router();

router.post('/', bookValidationRules.add, validate, BookController.addBook);

router.put('/:id', bookValidationRules.update, validate, BookController.updateBook);

router.delete('/:id', bookValidationRules.delete, validate, BookController.deleteBook);

router.get('/', BookController.listBooks);

router.get('/search', bookValidationRules.search, validate, BookController.searchBooks);

module.exports = router;
