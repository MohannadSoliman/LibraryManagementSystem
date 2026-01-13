const { body, param, query, validationResult } = require('express-validator');

const bookValidationRules = {
  add: [
    body('title').isString().isLength({ min: 1, max: 255 }).withMessage('Invalid title'),
    body('author').isString().isLength({ min: 1, max: 255 }).withMessage('Invalid author'),
    body('isbn').isString().isLength({ min: 1, max: 20 }).withMessage('Invalid ISBN'),
    body('available_quantity').optional().isInt({ min: 0 }).withMessage('Invalid quantity'),
    body('shelf_location').optional().isString().withMessage('Invalid shelf location'),
  ],
  update: [
    param('id').isInt({ gt: 0 }).withMessage('Book ID must be a positive integer'),
    body('title').optional().isString().isLength({ min: 1, max: 255 }).withMessage('Invalid title'),
    body('author').optional().isString().isLength({ min: 1, max: 255 }).withMessage('Invalid author'),
    body('isbn').optional().isString().isLength({ min: 1, max: 20 }).withMessage('Invalid ISBN'),
    body('available_quantity').optional().isInt({ min: 0 }).withMessage('Invalid quantity'),
    body('shelf_location').optional().isString().withMessage('Invalid shelf location'),
  ],
  delete: [
    param('id').isInt({ gt: 0 }).withMessage('Book ID must be a positive integer'),
  ],
  search: [
    query('query').optional().isString().isLength({ min: 1 }).withMessage('Search query must be a non-empty string'),
  ],
};

const borrowerValidationRules = {
  add: [
    body('name')
      .isString()
      .isLength({ min: 1, max: 255 })
      .withMessage('Name must be a non-empty string up to 255 characters'),
    body('email')
      .isEmail()
      .withMessage('Invalid email format')
      .isLength({ max: 255 })
      .withMessage('Email must be at most 255 characters'),
    body('registered_date')
      .isISO8601()
      .withMessage('registered_date must be a valid date (YYYY-MM-DD)'),
  ],
  update: [
    param('id').isInt({ gt: 0 }).withMessage('Borrower ID must be a positive integer'),
    body('name')
      .optional()
      .isString()
      .isLength({ min: 1, max: 255 })
      .withMessage('Name must be a non-empty string up to 255 characters'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Invalid email format')
      .isLength({ max: 255 })
      .withMessage('Email must be at most 255 characters'),
  ],
  delete: [
    param('id').isInt({ gt: 0 }).withMessage('Borrower ID must be a positive integer'),
  ],
};

const borrowingValidationRules = {
  checkout: [
    body('borrowerId')
      .isInt({ gt: 0 })
      .withMessage('borrowerId must be a positive integer'),
    body('books')
      .isArray({ min: 1 })
      .withMessage('books must be a non-empty array'),
    body('books.*.bookId')
      .isInt({ gt: 0 })
      .withMessage('Each bookId must be a positive integer'),
    body('books.*.dueDate')
      .isISO8601()
      .withMessage('Each dueDate must be a valid date (YYYY-MM-DD)'),
  ],
  return: [
    body('borrowingIds')
      .isArray({ min: 1 })
      .withMessage('borrowingIds must be a non-empty array'),
    body('borrowingIds.*')
      .isInt({ gt: 0 })
      .withMessage('Each borrowingId must be a positive integer'),
  ],
  listBorrowedBooks: [
    param('borrowerId')
      .isInt({ gt: 0 })
      .withMessage('Borrower ID must be a positive integer'),
  ],
};

const reportsValidationRules = {
  borrowingReport: [
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('startDate must be a valid date (YYYY-MM-DD)'),
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('endDate must be a valid date (YYYY-MM-DD)'),
    query('exportFormat')
      .optional()
      .isIn(['csv', 'xlsx'])
      .withMessage('exportFormat must be either "csv" or "xlsx"'),
  ],
  overdueLastMonth: [
    query('exportFormat')
      .optional()
      .isIn(['csv', 'xlsx'])
      .withMessage('exportFormat must be either "csv" or "xlsx"'),
  ],
  borrowingLastMonth: [
    query('exportFormat')
      .optional()
      .isIn(['csv', 'xlsx'])
      .withMessage('exportFormat must be either "csv" or "xlsx"'),
  ],
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

module.exports = { bookValidationRules, borrowerValidationRules, borrowingValidationRules, reportsValidationRules, validate };
