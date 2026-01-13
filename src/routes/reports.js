const express = require('express');
const router = express.Router();
const ReportsController = require('../controllers/reportsController');
const { reportsValidationRules, validate } = require('../middlewares/validateInput');

router.get(
  '/borrowing-report',
  reportsValidationRules.borrowingReport,
  validate,
  ReportsController.borrowingReport
);

router.get(
  '/overdue-last-month',
  reportsValidationRules.overdueLastMonth,
  validate,
  ReportsController.overdueLastMonth
);

router.get(
  '/borrowing-last-month',
  reportsValidationRules.borrowingLastMonth,
  validate,
  ReportsController.borrowingLastMonth
);

module.exports = router;
