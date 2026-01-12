const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Borrower = sequelize.define('Borrower', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  registered_date: { type: DataTypes.DATEONLY, allowNull: false },
}, {
  tableName: 'borrowers',
  timestamps: true,
});

module.exports = Borrower;
