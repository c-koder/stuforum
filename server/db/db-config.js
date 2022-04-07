const mysql = require("mysql");

const fabricate = require("./fabricate");

const USER = "baa3222a1c4772" || "root";
const PASSWORD = "319450b9" || "";
const HOST = "eu-cdbr-west-02.cleardb.net" || "localhost";
const DATABASE = "heroku_be0c7c366266a27" || "stuforum";

const db = mysql.createConnection({
  user: USER,
  password: PASSWORD,
  host: HOST,
  database: DATABASE,
});

db.connect(function (err) {
  if (!err) {
    db.query(`CREATE DATABASE IF NOT EXISTS ${DATABASE}`, (err, res) => {
      if (!err) {
        db.query(`USE ${DATABASE}`, (err, res) => {
          if (!err) {
            fabricate.create(db);
          }
        });
      }
    });
  }
});

module.exports = db;
