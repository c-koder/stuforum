const mysql = require("mysql");

const fabricate = require("./fabricate");

// const db = mysql.createConnection({
//   user: "	qx1onq4eu3usxho4",
//   password: "y59qgwtg32oaa71o",
//   host: "i54jns50s3z6gbjt.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
//   port: 3306,
//   database: "cp3zt6u8detuivdr",
// });

const db = mysql.createConnection({
  user: "root",
  password: "",
  host: "localhost",
  port: 3306,
  database: "stuforum",
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
