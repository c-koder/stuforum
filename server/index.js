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

app.use(cors());
app.use(express.json());

//register

app.post("/register", (req, res) => {
  const { name, student_id, student_email, password, join_date } = req.body;

  let userExistsQuery =
    "SELECT * FROM user WHERE student_email = ? OR student_id = ?";
  db.query(userExistsQuery, [student_email, student_id], (err, result) => {
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
          [name, student_id, student_email, hash, join_date],
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
            },
            "murofuts"
            // {
            //   expiresIn: 60 * 60 * 6,
            // }
          );
          res.send({
            token: accessToken,
            name: result[0].name,
            id: result[0].id,
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
  let sql =
    "SELECT id, name, student_email, description, avatar, join_date, likes FROM user WHERE id = ?";
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
  let sql = "SELECT * FROM user WHERE likes > 0 ORDER BY likes DESC LIMIT 5";
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

app.post("/postexists", (req, res) => {
  const id = req.body.post_id;
  db.query(
    "SELECT EXISTS(SELECT id FROM post WHERE id = ? LIMIT 1) AS count",
    id,
    (err, result) => {
      result[0].count == 1
        ? res.send({ message: "exists" })
        : res.send({ message: null });
    }
  );
});

app.post("/addpost", (req, res) => {
  const { question, description, tags, user_id, posted_time } = req.body;
  const urgent = req.body.urgent ? 1 : 0;

  let addSql =
    "INSERT INTO post(question, description, user_id, posted_time, urgent) VALUES(?, ?, ?, ?, ?)";
  db.query(
    addSql,
    [question, description, user_id, posted_time, urgent],
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

app.post("/deletepost", (req, res) => {
  const post_id = req.body.post_id;
  db.query(
    "DELETE p.*, r.* FROM post p LEFT JOIN reply r ON r.post_id = p.id WHERE p.id = ?",
    post_id,
    (err, result) => {
      if (!err) {
        res.send({ message: "success" });
      }
    }
  );
});

app.post("/getposts", (req, res) => {
  const { user_id, user_posts } = req.body;

  let sql = user_posts
    ? "SELECT p.*, u.name AS user_name FROM post p INNER JOIN user u ON u.id = p.user_id WHERE p.user_id = ? ORDER BY id DESC"
    : "SELECT p.*, u.name AS user_name FROM post p INNER JOIN user u ON u.id = p.user_id ORDER BY id DESC";

  db.query(sql, user_id, (err, result) => {
    if (!err) {
      db.query(
        "SELECT * FROM tag INNER JOIN post_tag ON post_tag.tag_id = tag.id AND post_tag.post_id in(SELECT p.id FROM post p, user u WHERE u.id = p.user_id)",
        (err, tagsResult) => {
          if (!err) {
            db.query(
              "SELECT * FROM post_pref pp WHERE post_id in (SELECT p.id FROM post p, user u WHERE u.id = p.user_id) AND user_id = ?",
              user_id,
              (err, postPrefResult) => {
                if (!err) {
                  res.send({
                    posts: result,
                    post_pref: postPrefResult,
                    tags: tagsResult,
                  });
                }
              }
            );
          }
        }
      );
    }
  });
});

app.post("/getsinglepost", (req, res) => {
  const post_id = req.body.post_id;

  db.query(
    "SELECT p.*, u.name AS user_name FROM post p INNER JOIN user u ON u.id = p.user_id WHERE p.id = ?",
    post_id,
    (err, result) => {
      if (!err) {
        db.query(
          "SELECT * FROM tag INNER JOIN post_tag ON post_tag.tag_id = tag.id AND post_tag.post_id = ?",
          post_id,
          (err, tagsResult) => {
            if (!err) {
              db.query(
                "SELECT * FROM post_pref WHERE post_id in (SELECT p.id FROM post p, user u WHERE u.id = p.user_id) AND post_id = ?",
                post_id,
                (err, postPrefResult) => {
                  if (!err) {
                    res.send({
                      post: result[0],
                      post_pref: postPrefResult,
                      tags: tagsResult,
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

app.post("/updateleadsprefs", (req, res) => {
  const { id, post_id, user_id, pref, leads, time } = req.body;

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

  db.query("UPDATE post SET leads = leads + ? WHERE id = ?", [leads, post_id]);

  db.query("SELECT user_id FROM post WHERE id = ?", post_id, (err, result) => {
    if (result[0].user_id != user_id && leads >= 1 && !err) {
      const data = {
        user_from_id: user_id,
        user_to_id: result[0].user_id,
        type: "UV",
        post_id: post_id,
        reply_id: null,
        child_reply_id: null,
        description: "up voted your question",
        time: time,
      };
      insertNotification(data);
    }
  });
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

// insert into post(question, description, user_id, posted_time) select question, description, user_id, posted_time from post where id=1;

//replies

app.post("/getreplies", (req, res) => {
  const post_id = req.body.post_id;
  db.query(
    "SELECT r.*, u.name AS user_name, u2.name AS replied_to FROM reply r LEFT JOIN user u ON u.id = r.user_id LEFT JOIN user u2 ON u2.id = r.replied_to_id WHERE r.post_id = ?",
    post_id,
    (err, result) => {
      if (!err) {
        res.send(result);
      }
    }
  );
});

app.post("/getreplydata", (req, res) => {
  const { reply_id, user_id } = req.body;

  db.query(
    "SELECT * FROM reply_pref WHERE user_id = ? AND reply_id = ?",
    [user_id, reply_id],
    (err, result) => {
      if (!err) {
        res.send(result[0]);
      }
    }
  );
});

app.post("/addreply", (req, res) => {
  const { parent_id, user_id, replied_to, post_id, replied_time, description } =
    req.body;

  db.query(
    "INSERT INTO reply(parent_id, user_id, replied_to_id, post_id, replied_time, description) VALUES(?, ?, ?, ?, ?, ?)",
    [parent_id, user_id, replied_to, post_id, replied_time, description],
    (err, result) => {
      if (!err) {
        db.query(
          "UPDATE post SET comments = comments + 1 WHERE id = ?",
          post_id
        );
        db.query(
          "SELECT user_id FROM post WHERE id = ?",
          post_id,
          (err, userIdResult) => {
            let user_to_id = replied_to != user_id ? replied_to : null;
            if (userIdResult[0].user_id != user_id && !err) {
              user_to_id = userIdResult[0].user_id;
            }
            if (user_to_id != null) {
              const data = {
                user_from_id: user_id,
                user_to_id: user_to_id,
                type: "CM",
                post_id: post_id,
                reply_id: result.insertId,
                description:
                  parent_id != null
                    ? "sub-answered on your question"
                    : "answered on your question",
                time: replied_time,
              };
              insertNotification(data);
            }
          }
        );
        if (replied_to != null) {
          db.query(
            "SELECT u.name FROM user u, reply r WHERE u.id = ? AND r.id = ?",
            [replied_to, result.insertId],
            (err, repliedToResult) => {
              res.send({
                id: result.insertId,
                replied_to: repliedToResult[0].name,
              });
            }
          );
        } else {
          res.send({
            id: result.insertId,
            replied_to: null,
          });
        }
      }
    }
  );
});

app.post("/deletereply", (req, res) => {
  const { post_id, reply_id, delete_child_only } = req.body;

  if (!delete_child_only) {
    db.query(
      "DELETE FROM reply WHERE id = ? OR parent_id = ?",
      [reply_id, reply_id],
      (err, result) => {
        if (!err) {
          db.query("UPDATE post SET comments = comments - ? WHERE id = ?", [
            result.affectedRows,
            post_id,
          ]);
        }
      }
    );
  } else {
    db.query("DELETE FROM reply WHERE id = ?", reply_id, (err, result) => {
      if (!err) {
        db.query(
          "UPDATE post SET comments = comments - 1 WHERE id = ?",
          post_id
        );
      }
    });
  }
});

app.post("/updatereplypref", (req, res) => {
  const {
    id,
    reply_id,
    parent_id,
    user_id,
    post_id,
    pref,
    previous_pref,
    reply_posted_user_id,
    time,
  } = req.body;

  let updateLikesDislikesQuery = "UPDATE reply SET ";
  let updateUserLikes = "UPDATE user SET ";

  if (id != null) {
    db.query("UPDATE reply_pref SET preference = ? WHERE id = ?", [pref, id]);
  } else {
    db.query(
      "INSERT INTO reply_pref(reply_id, user_id, preference) VALUES(?, ?, ?)",
      [reply_id, user_id, pref]
    );
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
    updateUserLikes += "likes = likes - 1";
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
  db.query(
    "SELECT user_id FROM reply WHERE id = ?",
    reply_id,
    (err, result) => {
      if (result[0].user_id != user_id && pref == "1" && !err) {
        const data = {
          user_from_id: user_id,
          user_to_id: result[0].user_id,
          type: "LK",
          post_id: post_id,
          reply_id: reply_id,
          description:
            parent_id != null ? "liked your sub-answer" : "liked your answer",
          time: time,
        };
        insertNotification(data);
      }
    }
  );
});

// user_answers

app.post("/getanswers", (req, res) => {
  const user_id = req.body.user_id;
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

// notifications

app.post("/getnotifications", (req, res) => {
  const user_id = req.body.user_id;

  db.query(
    "SELECT n.*, u.name AS user_from, u2.name AS user_to FROM notification n LEFT JOIN user u ON u.id = n.user_from_id LEFT JOIN user u2 ON u2.id = n.user_to_id WHERE user_to_id = ? ORDER BY id DESC",
    user_id,
    (err, result) => {
      if (!err) {
        res.send(result);
      }
    }
  );
});

/* types
 * UV - up voted
 * LK - liked
 * CM - commented
 */

const insertNotification = (data) => {
  if (data.type == "CM") {
    db.query(
      "INSERT INTO notification(user_from_id, user_to_id, type, post_id, reply_id, description, time) SELECT ?, ?, ?, ?, ?, ?, ? FROM DUAL WHERE NOT EXISTS (SELECT id FROM notification WHERE user_from_id = ? AND user_to_id = ? AND type = ? AND time = ?)",
      [
        data.user_from_id,
        data.user_to_id,
        data.type,
        data.post_id,
        data.reply_id,
        data.description,
        data.time,
        data.user_from_id,
        data.user_to_id,
        data.type,
        data.time,
      ]
    );
  } else {
    db.query(
      "INSERT INTO notification(user_from_id, user_to_id, type, post_id, reply_id, description, time) SELECT ?, ?, ?, ?, ?, ?, ? FROM DUAL WHERE NOT EXISTS (SELECT id FROM notification WHERE user_from_id = ? AND user_to_id = ? AND type = ? AND reply_id = ?)",
      [
        data.user_from_id,
        data.user_to_id,
        data.type,
        data.post_id,
        data.reply_id,
        data.description,
        data.time,
        data.user_from_id,
        data.user_to_id,
        data.type,
        data.reply_id,
      ]
    );
  }
};

app.listen(3001, () => {
  console.log("Server Running on Port: 3001");
});
