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

  db.query(
    "SELECT * FROM tag INNER JOIN post_tag ON post_tag.tag_id = tag.id AND post_tag.post_id = ?",
    post_id,
    (err, tagsResult) => {
      if (!err) {
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
        if (tags.length > 0) {
          tags.map((tag) => {
            db.query(
              "SELECT id FROM tag WHERE name = ?",
              tag,
              (err, result) => {
                if (result.length <= 0) {
                  db.query(
                    "INSERT INTO tag(name, frequency) VALUES(?, 1)",
                    tag,
                    (err, tagResult) => {
                      if (!err) {
                        db.query(
                          "INSERT INTO post_tag(post_id, tag_id) VALUES(?, ?)",
                          [addResult.insertId, tagResult.insertId]
                        );
                      }
                    }
                  );
                } else {
                  db.query(
                    "INSERT INTO post_tag(post_id, tag_id) VALUES(?, ?)",
                    [addResult.insertId, result[0].id]
                  );
                  db.query(
                    "UPDATE tag SET frequency = frequency + 1 WHERE id = ?",
                    result[0].id
                  );
                }
              }
            );
          });
        }
        res.send({ id: addResult.insertId, message: "post_added" });
      }
    }
  );
});

app.post("/getposts", (req, res) => {
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
      [post_id, user_id, pref],
      (err, result) => {
        if (!err) {
          res.send({ id: result.insertId });
        }
      }
    );
  }

  db.query(
    "UPDATE post SET leads = leads + ? WHERE id = ?",
    [leads, post_id],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
    }
  );
});

app.post("/updatepoststatus", (req, res) => {
  const { post_id, status } = req.body;
  const new_status = req.body.new_status == 0 ? 1 : 0;

  let sql = "UPDATE post SET ";
  if (status == "urgent") {
    sql += "urgent = ?";
  } else if (status == "answered") {
    sql += "answered = ?";
  }
  sql += " WHERE id = ?";

  db.query(sql, [new_status, post_id], (err, result) => {
    if (!err) {
      res.send({ message: "updated" });
    }
  });
});

app.post("/getcommentcount", (req, res) => {
  const post_id = req.body.post_id;
  db.query("SELECT comments FROM post WHERE id = ?", post_id, (err, result) => {
    if (result.length > 0) {
      res.send(result[0]);
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
    "SELECT * FROM tag WHERE frequency > 0 ORDER BY frequency DESC LIMIT 3";
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

app.post("/getreplydata", (req, res) => {
  const { parent_id, child_id, user_id } = req.body;

  let reply_id;
  let sql = "SELECT * FROM reply_pref WHERE user_id = ? AND ";

  if (child_id == null) {
    sql += "parent_reply_id = ?";
    reply_id = parent_id;
  } else {
    sql += "child_reply_id = ?";
    reply_id = child_id;
  }

  db.query(sql, [user_id, reply_id], (err, replyPrefResult) => {
    if (!err) {
      res.send(replyPrefResult[0]);
    }
  });
});

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
          db.query(
            "UPDATE post SET comments = comments + 1 WHERE id = ?",
            post_id
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
          db.query(
            "UPDATE post SET comments = comments + 1 WHERE id = ?",
            post_id
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
    if (!err) {
      db.query(
        "SELECT * FROM child_reply WHERE post_id = ?",
        post_id,
        (childReplyErr, childReplyResult) => {
          if (!childReplyErr) {
            res.send({ replies: result, child_replies: childReplyResult });
          }
        }
      );
    }
  });
});

app.post("/deletereply", (req, res) => {
  const { post_id, reply_id, delete_child_only } = req.body;

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
              if (!err) {
                db.query(
                  "UPDATE post SET comments = comments - ? WHERE id = ?",
                  [result.affectedRows + 1, post_id],
                  (err, result) => {
                    if (err) {
                      res.send({ err: err });
                    }
                  }
                );
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
        if (!err) {
          db.query(
            "UPDATE post SET comments = comments - 1 WHERE id = ?",
            post_id,
            (err, result) => {
              if (!err) {
                res.send({ message: "success" });
              }
            }
          );
        }
      }
    );
  }
});

app.post("/updatereplypref", (req, res) => {
  const {
    id,
    parent_id,
    child_id,
    user_id,
    pref,
    previous_pref,
    reply_posted_user_id,
  } = req.body;

  let reply_id;
  let updateLikesDislikesQuery = "";
  let updateUserLikes = "UPDATE user SET ";

  if (id != null) {
    db.query("UPDATE reply_pref SET preference = ? WHERE id = ?", [pref, id]);
    if (child_id != null) {
      reply_id = child_id;
      updateLikesDislikesQuery = "UPDATE child_reply SET ";
    } else if (parent_id != null) {
      reply_id = parent_id;
      updateLikesDislikesQuery = "UPDATE reply SET ";
    }
  } else {
    if (child_id != null) {
      reply_id = child_id;
      updateLikesDislikesQuery = "UPDATE child_reply SET ";
      db.query(
        "INSERT INTO reply_pref(child_reply_id, user_id, preference) VALUES(?, ?, ?)",
        [child_id, user_id, pref]
      );
    } else {
      reply_id = parent_id;
      updateLikesDislikesQuery = "UPDATE reply SET ";
      db.query(
        "INSERT INTO reply_pref(parent_reply_id, user_id, preference) VALUES(?, ?, ?)",
        [parent_id, user_id, pref]
      );
    }
  }

  if (pref == "1") {
    if (previous_pref == "disliked") {
      updateLikesDislikesQuery +=
        "likes = likes + 1 , dislikes = dislikes - 1 WHERE id = ?";
    } else if (previous_pref == "") {
      updateLikesDislikesQuery += "likes = likes + 1 WHERE id = ?";
    }
    updateUserLikes += "likes = likes + 1";
  } else if (pref == "0") {
    if (previous_pref == "liked") {
      updateLikesDislikesQuery +=
        "dislikes = dislikes + 1 , likes = likes - 1 WHERE id = ?";
    } else if (previous_pref == "") {
      updateLikesDislikesQuery += "dislikes = dislikes + 1 WHERE id = ?";
    }
  } else {
    if (previous_pref == "liked") {
      updateLikesDislikesQuery += "likes = likes - 1 WHERE id = ?";
    } else if (previous_pref == "disliked") {
      updateLikesDislikesQuery += "dislikes = dislikes - 1 WHERE id = ?";
    }
    updateUserLikes += "likes = likes - 1";
  }

  updateUserLikes += " WHERE id = ? AND NOT id = ?";

  db.query(updateLikesDislikesQuery, reply_id);
  db.query(updateUserLikes, [reply_posted_user_id, user_id]);
});

// user_answers

app.post("/getanswers", (req, res) => {
  const user_id = req.body.user_id;
  // "SELECT * FROM reply WHERE user_id = ? GROUP BY post_id ORDER BY id DESC"
  db.query(
    "SELECT p.* FROM reply r JOIN post p ON r.post_id = p.id WHERE NOT p.user_id = ? GROUP BY p.id ORDER BY p.id DESC",
    user_id,
    (err, postResults) => {
      if (!err) {
        db.query(
          "SELECT r.* FROM reply r JOIN post p ON r.post_id = p.id WHERE r.user_id = ? AND NOT p.user_id = ? GROUP BY p.id ORDER BY p.id DESC",
          [user_id, user_id],
          (err, replyResults) => {
            if (!err) res.send({ posts: postResults, replies: replyResults });
          }
        );
      }
    }
  );
});

//error status

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.error = err;
  const status = err.status || 500;
  res.status(status);
  res.render("error");
});

app.listen(3001, () => {
  console.log("Server Running on Port: 3001");
});
