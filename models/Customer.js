const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Customer = sequelize.define("Customer", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastVisit: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  service: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = Customer;
