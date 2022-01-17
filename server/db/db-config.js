const mysql = require("mysql");

const db = mysql.createConnection({
  user: "root",
  password: "",
  host: "localhost",
  port: "3307",
  database: "stuforum",
});

module.exports = db;
