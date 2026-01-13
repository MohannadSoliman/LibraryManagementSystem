const express = require('express');
const BorrowingController = require('../controllers/borrowingsController');

const router = express.Router();

router.post('/checkout', BorrowingController.checkoutBooks);

router.post('/return', BorrowingController.returnBooks);

router.get('/borrower/:borrowerId', BorrowingController.listBorrowedBooks);

router.get('/overdue', BorrowingController.listOverdue);

module.exports = router;
