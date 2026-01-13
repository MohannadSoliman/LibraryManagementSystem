const Borrower = require('../models/borrower');

// Simple in-memory cache
let borrowersCache = null;

const BorrowerController = {

  // Add/Register a borrower
  async addBorrower(req, res, next) {
    try {
      const { name, email, registered_date } = req.body;
      const newBorrower = await Borrower.create({ name, email, registered_date });
      
      // Invalidate cache
      borrowersCache = null;

      res.json({ success: true, borrower: newBorrower });
    } catch (err) {
      err.message = `Borrower addition failed: ${err.message}`;
      next(err);
    }
  },

  // Update borrower details
  async updateBorrower(req, res, next) {
    try {
      const { id } = req.params;
      const { name, email } = req.body;
      const borrower = await Borrower.findByPk(id);
      if (!borrower) return res.status(404).json({ success: false, error: 'Borrower not found' });

      await borrower.update({ name, email });

      // Invalidate cache
      borrowersCache = null;

      res.json({ success: true, borrower });
    } catch (err) {
      err.message = `Borrower update failed: ${err.message}`;
      next(err);
    }
  },

  // Delete borrower
  async deleteBorrower(req, res, next) {
    try {
      const { id } = req.params;
      const borrower = await Borrower.findByPk(id);
      if (!borrower) return res.status(404).json({ success: false, error: 'Borrower not found' });

      await borrower.destroy();

      // Invalidate cache
      borrowersCache = null;

      res.json({ success: true });
    } catch (err) {
      err.message = `Borrower deletion failed: ${err.message}`;
      next(err);
    }
  },

  // List all borrowers (cached)
  async listBorrowers(req, res, next) {
    try {
      if (!borrowersCache) {
        const borrowers = await Borrower.findAll();
        borrowersCache = borrowers; // cache the result
      }
      res.json({ success: true, borrowers: borrowersCache });
    } catch (err) {
      err.message = `Listing borrowers failed: ${err.message}`;
      next(err);
    }
  },
};

module.exports = BorrowerController;
