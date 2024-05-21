const { Sequelize } = require("sequelize");

const db = new Sequelize("basedatos", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = db;
