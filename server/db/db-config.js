const mysql = require("mysql");

const fabricate = require("./fabricate");

// const DATABASE = "stuforum";

// const db = mysql.createConnection({
//   user: "bd53d86651de01",
//   password: "a02da056",
//   host: "eu-cdbr-west-02.cleardb.net",
//   database: "heroku_0c59dc1ccefc3d5",
// });

const db = mysql.createConnection({
  user: "root",
  password: "",
  host: "localhost",
  port: 3306,
  // database: "stuforum",
});

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
