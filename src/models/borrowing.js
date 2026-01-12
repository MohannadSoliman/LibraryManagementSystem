const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Book = require('./book');
const Borrower = require('./borrower');

const Borrowing = sequelize.define('Borrowing', {
  borrowed_date: { type: DataTypes.DATEONLY, allowNull: false },
  due_date: { type: DataTypes.DATEONLY, allowNull: false },
  returned_date: { type: DataTypes.DATEONLY, allowNull: true },
}, {
  tableName: 'borrowings',
  timestamps: true,
});

// Relationships
Book.hasMany(Borrowing, { foreignKey: 'book_id', onDelete: 'CASCADE' });
Borrowing.belongsTo(Book, { foreignKey: 'book_id', onDelete: 'CASCADE' });

Borrower.hasMany(Borrowing, { foreignKey: 'borrower_id', onDelete: 'CASCADE' });
Borrowing.belongsTo(Borrower, { foreignKey: 'borrower_id', onDelete: 'CASCADE' });

module.exports = Borrowing;
