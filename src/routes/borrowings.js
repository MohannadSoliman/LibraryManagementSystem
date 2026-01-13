const express = require('express');
const BorrowingController = require('../controllers/borrowingsController');
const { borrowingValidationRules, validate } = require('../middlewares/validateInput');
const router = express.Router();

router.post('/checkout', borrowingValidationRules.checkout, validate, BorrowingController.checkoutBooks);

router.post('/return', borrowingValidationRules.return, validate, BorrowingController.returnBooks);

router.get('/borrower/:borrowerId', borrowingValidationRules.listBorrowedBooks, 
           validate, BorrowingController.listBorrowedBooks);

router.get('/overdue', BorrowingController.listOverdue);

module.exports = router;
