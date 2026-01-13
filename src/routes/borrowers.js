const express = require('express');
const BorrowerController = require('../controllers/borrowersController');
const { borrowerValidationRules, validate } = require('../middlewares/validateInput');

const router = express.Router();

router.post('/', borrowerValidationRules.add, validate, BorrowerController.addBorrower);

router.put('/:id', borrowerValidationRules.update, validate, BorrowerController.updateBorrower);

router.delete('/:id', borrowerValidationRules.delete, validate, BorrowerController.deleteBorrower);

router.get('/', BorrowerController.listBorrowers);

module.exports = router;
