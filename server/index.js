const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { validateToken } = require("./middleware/AuthMiddleware");
const bcrypt = require("bcrypt");
const app = express();

const db = mysql.createConnection({
  user: "root",
  password: "",
  host: "localhost",
  port: "3307",
  database: "stuforum",
});

// app.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   next();
// });

app.use(cors());

// app.use(
//   cors({
//     origin: true,
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     preflightContinue: true,
//     optionsSuccessStatus: 204,
//     credentials: true,
//   })
// );

app.use(express.json());

//register

app.post("/register", (req, res) => {
  const { name, studentId, studentEmail, password, joinDate } = req.body;

  let userExistsQuery =
    "SELECT * FROM user WHERE student_email = ? OR student_id = ?";
  db.query(userExistsQuery, [studentEmail, studentId], (err, result) => {
    if (err) {
      res.send({ err: err });
    }
    if (result.length > 0) {
      res.send({ message: "user_exists" });
    } else {
      bcrypt.hash(password, 10, (hash_error, hash) => {
        if (hash_error) {
          console.log(hash_error);
        }
        let sql =
          "INSERT INTO user(name, student_id, student_email, password, join_date) VALUES (?, ?, ?, ?, ?)";
        db.query(
          sql,
          [name, studentId, studentEmail, hash, joinDate],
          (err, result) => {
            if (err) {
              res.send({ err: err });
            } else {
              res.send({ message: "user_added" });
            }
          }
        );
      });
    }
  });
});

//login

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  let usernameSql =
    "SELECT * FROM user WHERE student_id = ? OR student_email = ?";
  db.query(usernameSql, [username, username], (err, result) => {
    if (err) {
      res.send({ err: err });
    }
    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (error, response) => {
        if (response) {
          const accessToken = jwt.sign(
            {
              name: result[0].name,
              id: result[0].id,
              join_date: result[0].join_date,
              description: result[0].description,
              likes: result[0].likes,
            },
            "murofuts",
            {
              expiresIn: 60 * 60 * 6,
            }
          );
          res.send({
            token: accessToken,
            name: result[0].name,
            id: result[0].id,
            join_date: result[0].join_date,
            description: result[0].description,
            likes: result[0].likes,
          });
        } else {
          res.send({ message: "wrong_password" });
        }
      });
    } else {
      res.send({ message: "user_not_found" });
    }
  });
});

//authentication

app.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

//users

app.post("/getuser", (req, res) => {
  const id = req.body.id;

  let sql = "SELECT * FROM user WHERE id = ?";
  db.query(sql, id, (err, result) => {
    if (err) {
      res.send({ err: err });
    }
    if (result.length > 0) {
      res.send(result[0]);
    }
  });
});

app.post("/getsortedusers", (req, res) => {
  let sql = "SELECT * FROM user WHERE likes >= 0 ORDER BY likes DESC LIMIT 5";
  db.query(sql, (err, result) => {
    if (err) {
      res.send({ err: err });
    }
    if (result.length > 0) {
      res.send(result);
    }
  });
});

app.post("/getuserposts", (req, res) => {
  const user_id = req.body.user_id;

  let sql = "SELECT * FROM post WHERE user_id = ? ORDER BY id DESC";
  db.query(sql, user_id, (err, result) => {
    if (err) {
      res.send({ err: err });
    }
    if (result.length > 0) {
      res.send(result);
    }
  });
});

//posts

app.post("/getpostdata", (req, res) => {
  const post_id = req.body.post_id;
  const user_id = req.body.user_id;

  //tags
  db.query(
    "SELECT * FROM tag INNER JOIN post_tag ON post_tag.tag_id = tag.id AND post_tag.post_id = ?",
    post_id,
    (err, tagsResult) => {
      if (!err) {
        //post pref
        db.query(
          "SELECT * FROM post_pref WHERE user_id = ? AND post_id = ?",
          [user_id, post_id],
          (err, postPrefResult) => {
            if (!err) {
              res.send({ post_pref: postPrefResult[0], tags: tagsResult });
            }
          }
        );
      }
    }
  );
});

app.post("/addpost", (req, res) => {
  const { question, description, tags, user_id, user_name, posted_time } =
    req.body;
  const urgent = req.body.urgent ? 1 : 0;

  let addSql =
    "INSERT INTO post(question, description, user_id, user_name, posted_time, urgent) VALUES(?, ?, ?, ?, ?, ?)";
  db.query(
    addSql,
    [question, description, user_id, user_name, posted_time, urgent],
    (addErr, addResult) => {
      if (!addErr) {
        res.send({ message: "post_added" });
      }
    }
  );
});

app.post("/getposts", (req, res) => {
  // ORDER BY id DESC
  let sql = "SELECT * FROM post ORDER BY id DESC";
  db.query(sql, (err, result) => {
    if (err) {
      res.send({ err: err });
    }
    if (result.length > 0) {
      res.send(result);
    }
  });
});

app.post("/getsinglepost", (req, res) => {
  const post_id = req.body.post_id;

  db.query("SELECT * FROM post WHERE id = ?", post_id, (err, result) => {
    if (!err) {
      res.send(result);
    }
  });
});

app.post("/updateleadsprefs", (req, res) => {
  const { id, post_id, user_id, pref, leads } = req.body;

  if (id != null) {
    db.query("UPDATE post_pref SET preference = ? WHERE id = ?", [pref, id]);
  } else {
    db.query(
      "INSERT INTO post_pref(post_id, user_id, preference) VALUES(?, ?, ?)",
      [post_id, user_id, pref]
    );
  }

  db.query("SELECT leads FROM post WHERE id = ?", post_id, (err, result) => {
    if (err) {
      res.send({ err: err });
    }
    if (result.length > 0) {
      const newLeads = parseInt(result[0].leads) + leads;
      db.query(
        "UPDATE post SET leads = ? WHERE id = ?",
        [newLeads, post_id],
        (err, updateRes) => {
          if (err) {
            res.send({ err: err });
          }
        }
      );
    }
  });
  res.end();
});

app.post("/updatepoststatus", (req, res) => {
  const post_id = req.body.post_id;
  const status = req.body.status;
  const new_status = req.body.new_status;

  let sql;
  if (status == "urgent") {
    sql = "UPDATE post SET urgent = ? WHERE id = ?";
  } else if (status == "answered") {
    sql = "UPDATE post SET answered = ? WHERE id = ?";
  }

  db.query(sql, [new_status, post_id], (err, result) => {
    if (err) {
      res.send({ err: err });
    } else {
      res.send({ message: "updated" });
    }
  });
});

//tags

app.post("/getalltags", (req, res) => {
  let sql = "SELECT * FROM tag ORDER BY name";
  db.query(sql, (err, result) => {
    if (err) {
      res.send({ err: err });
    }
    if (result.length > 0) {
      res.send(result);
    }
  });
});

app.post("/getsortedtags", (req, res) => {
  let sql =
    "SELECT * FROM tag WHERE frequency > 0 ORDER BY frequency DESC LIMIT 5";
  db.query(sql, (err, result) => {
    if (err) {
      res.send({ err: err });
    }
    if (result.length > 0) {
      res.send(result);
    }
  });
});

//replies

app.post("/addreply", (req, res) => {
  const {
    parent_id,
    user_id,
    user_name,
    replied_to,
    post_id,
    replied_time,
    description,
  } = req.body;

  if (replied_to != "") {
    db.query(
      "INSERT INTO child_reply(parent_id, user_id, user_name, replied_to, post_id, replied_time, description) VALUES(?, ?, ?, ?, ?, ?, ?)",
      [
        parent_id,
        user_id,
        user_name,
        replied_to,
        post_id,
        replied_time,
        description,
      ],
      (childReplyErr, result) => {
        if (!childReplyErr) {
          db.query(
            "SELECT id FROM child_reply WHERE user_id = ? AND replied_time = ?",
            [user_id, replied_time],
            (selectErr, selectResult) => {
              if (!selectErr) {
                res.send(selectResult[0]);
              }
            }
          );
        }
      }
    );
  } else {
    db.query(
      "INSERT INTO reply(user_id, user_name, post_id, replied_time, description) VALUES(?, ?, ?, ?, ?)",
      [user_id, user_name, post_id, replied_time, description],
      (err, result) => {
        if (!err) {
          db.query(
            "SELECT id FROM reply WHERE user_id = ? AND replied_time = ?",
            [user_id, replied_time],
            (selectErr, selectResult) => {
              if (!selectErr) {
                res.send(selectResult[0]);
              }
            }
          );
        }
      }
    );
  }
});

app.post("/getreplies", async (req, res) => {
  const post_id = req.body.post_id;

  let sql = "SELECT * FROM reply WHERE post_id = ?";
  db.query(sql, post_id, (err, result) => {
    if (err) {
      res.send({ err: err });
    }
    if (result.length > 0) {
      let childRepliesSql = "SELECT * FROM child_reply WHERE post_id = ?";
      db.query(childRepliesSql, post_id, (err, childReplyResult) => {
        if (err) {
          res.send({ err: err });
        }
        if (childReplyResult.length > 0) {
          res.send({ replies: result, child_replies: childReplyResult });
        }
      });
    }
  });
});

app.post("/deletereply", (req, res) => {
  const { reply_id, delete_child_only } = req.body;

  if (!delete_child_only) {
    db.query(
      "DELETE FROM reply WHERE id = ?",
      reply_id,
      (parentErr, parentResult) => {
        if (!parentErr) {
          db.query(
            "DELETE FROM child_reply WHERE parent_id = ?",
            reply_id,
            (err, result) => {
              if (err) {
                res.send({ err: err });
              } else {
                res.send({ message: "success" });
              }
            }
          );
        }
      }
    );
  } else {
    db.query(
      "DELETE FROM child_reply WHERE id = ?",
      reply_id,
      (err, result) => {
        if (err) {
          res.send({ err: err });
        } else {
          res.send({ message: "success" });
        }
      }
    );
  }
});

app.listen(3001, () => {
  console.log("Server Running on Port: 3001");
});
