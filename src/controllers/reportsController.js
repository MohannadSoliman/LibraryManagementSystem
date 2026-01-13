const Borrowing = require('../models/borrowing');
const Book = require('../models/book');
const Borrower = require('../models/borrower');
const { Op } = require('sequelize');
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');

const ReportsController = {

  // Helper for exporting data as CSV or XLSX
  async exportData(res, data, filename, sheetName, exportFormat = 'csv') {
    // If no data is provided, return an empty response with a message
    if (!data || data.length === 0) {
        return res.status(200).json({ success: true, message: 'No data available', data: [] });
    }

    // Extract the keys from the first object to use as headers for CSV/XLSX
    const headers = Object.keys(data[0]);

    if (exportFormat === 'csv') {
        // Create a CSV parser with the headers
        const parser = new Parser(headers);
        // Convert the data array to CSV format
        const csv = parser.parse(data);
        // Set response headers to indicate a CSV file attachment
        res.header('Content-Type', 'text/csv');
        res.attachment(`${filename}.csv`);
        // Send the CSV file in the response
        return res.send(csv);

    } else if (exportFormat === 'xlsx') {
        // Create a new Excel workbook
        const workbook = new ExcelJS.Workbook();
        // Add a worksheet, using the provided sheetName or default to 'Sheet1'
        const sheet = workbook.addWorksheet(sheetName || 'Sheet1');
        // Add the header row
        sheet.addRow(headers);
        // Add each row of data to the sheet
        data.forEach(item => sheet.addRow(Object.values(item)));
        // Set response headers for XLSX file attachment
        res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.attachment(`${filename}.xlsx`);
        // Write the workbook to the response and end it
        return workbook.xlsx.write(res).then(() => res.end());
    }

    // Fallback: if exportFormat is neither CSV nor XLSX, return JSON
    res.json({ success: true, data });
  },

  async borrowingReport(req, res, next) {
    try {
      const { startDate, endDate, exportFormat = 'csv' } = req.query;

      const where = {};
      // First begin with adding the starting date if exists
      if (startDate) where.borrowed_date = { [Op.gte]: new Date(startDate) };
      // Second if the end date exists, then update the object by first including the start using spread operator
      // Then add the end date condition
      if (endDate) where.borrowed_date = { ...where.borrowed_date, [Op.lte]: new Date(endDate) };

      const borrowings = await Borrowing.findAll({ where, include: [Book, Borrower] });

      const data = borrowings.map(b => ({
        id: b.id,
        borrower_id: b.borrower_id,
        borrower_name: b.Borrower?.name,
        book_id: b.book_id,
        book_title: b.Book?.title,
        borrowed_date: b.borrowed_date,
        due_date: b.due_date,
        returned_date: b.returned_date,
      }));

      return ReportsController.exportData(res, data, 'borrowing_report', 'Borrowings', exportFormat);
    } catch (err) {
      err.message = `Borrowing report generation failed: ${err.message}`;
      next(err);
    }
  },

  async overdueLastMonth(req, res, next) {
    try {
      const { exportFormat = 'csv' } = req.query;
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);

      const borrowings = await Borrowing.findAll({
        where: {
          due_date: { [Op.between]: [thirtyDaysAgo, today] },
          returned_date: null,
        },
        include: [Book, Borrower],
      });

      const data = borrowings.map(b => ({
        id: b.id,
        borrower_id: b.borrower_id,
        borrower_name: b.Borrower?.name,
        book_id: b.book_id,
        book_title: b.Book?.title,
        borrowed_date: b.borrowed_date,
        due_date: b.due_date,
      }));

      return ReportsController.exportData(res, data, 'overdue_last_month', 'OverdueLast30Days', exportFormat);
    } catch (err) {
      err.message = `Overdue report failed: ${err.message}`;
      next(err);
    }
  },

  // All borrowings in the last 30 days (rolling period)
  async borrowingLastMonth(req, res, next) {
    try {
      const { exportFormat = 'csv' } = req.query;
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);

      const borrowings = await Borrowing.findAll({
        where: { borrowed_date: { [Op.between]: [thirtyDaysAgo, today] } },
        include: [Book, Borrower],
      });

      const data = borrowings.map(b => ({
        id: b.id,
        borrower_id: b.borrower_id,
        borrower_name: b.Borrower?.name,
        book_id: b.book_id,
        book_title: b.Book?.title,
        borrowed_date: b.borrowed_date,
        due_date: b.due_date,
        returned_date: b.returned_date,
      }));

      return ReportsController.exportData(res, data, 'borrowings_last_month', 'BorrowingsLast30Days', exportFormat);
    } catch (err) {
      err.message = `Borrowings last month export failed: ${err.message}`;
      next(err);
    }
  }
};

module.exports = ReportsController;
