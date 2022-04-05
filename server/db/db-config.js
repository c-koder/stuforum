const mysql = require("mysql");

const fabricate = require("./fabricate");

// const DATABASE = "stuforum";

const db = mysql.createConnection({
  password: "djyee6jxhu38olec",
  host: "i54jns50s3z6gbjt.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
  port: 3306,
  database: "ek6jorwy8tgebmrn",
});

// const db = mysql.createConnection({
//   user: "root",
//   password: "",
//   host: "localhost",
//   port: 3306,
//   // database: "stuforum",
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
