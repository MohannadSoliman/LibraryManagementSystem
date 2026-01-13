const express = require('express');
const BorrowerController = require('../controllers/borrowersController');

const router = express.Router();

router.post('/', BorrowerController.addBorrower);

router.put('/:id', BorrowerController.updateBorrower);

router.delete('/:id', BorrowerController.deleteBorrower);

router.get('/', BorrowerController.listBorrowers);

module.exports = router;
