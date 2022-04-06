const mysql = require("mysql");

const fabricate = require("./fabricate");

const db = mysql.createConnection({
  user: "baa3222a1c4772",
  password: "319450b9",
  host: "eu-cdbr-west-02.cleardb.net",
  database: "heroku_be0c7c366266a27",
});

// const db = mysql.createConnection({
//   user: "root",
//   password: "",
//   host: "localhost",
//   port: 3306,
//   database: "stuforum",
// });

db.connect(function (err) {
  if (!err) {
    db.query("CREATE DATABASE IF NOT EXISTS stuforum", (err, res) => {
      if (!err) {
        db.query("USE stuforum", (err, res) => {
          if (!err) {
            fabricate.create(db);
          }
        });
      }
    });
  }
});

module.exports = db;
