const mysql = require("mysql");

const fabricate = require("./fabricate");

const DATABASE = "stuforum";

const db = mysql.createConnection({
  user: "root",
  password: "",
  host: "localhost",
  port: "3307",
});

db.connect(function (err) {
  if (!err) {
    db.query(`CREATE DATABASE IF NOT EXISTS ${DATABASE}`, (err, result) => {
      if (!err) {
        db.query(`USE ${DATABASE}`);
        fabricate.create(db);
      }
    });
  }
});

module.exports = db;
