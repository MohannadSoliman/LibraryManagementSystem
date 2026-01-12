const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Book = sequelize.define('Book', {
  title: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: false },
  isbn: { type: DataTypes.STRING, allowNull: false, unique: true },
  available_quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
  shelf_location: { type: DataTypes.STRING },
}, {
  tableName: 'books',
  timestamps: true,
});

module.exports = Book;
