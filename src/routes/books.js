const express = require('express');
const BookController = require('../controllers/booksController');

const router = express.Router();

router.post('/', BookController.addBook);

router.put('/:id', BookController.updateBook);

router.delete('/:id', BookController.deleteBook);

router.get('/', BookController.listBooks);

router.get('/search', BookController.searchBooks);

module.exports = router;
