const db = require("../db/db-config");

const notificationService = require("../services/notificationService");

const getPosts = (user_id, user_posts, tagged) => {
  let params = user_id;

  let sql = user_posts
    ? "SELECT p.*, u.nick_name AS nick_name FROM post p INNER JOIN user u ON u.id = p.user_id WHERE p.user_id = ? ORDER BY id DESC"
    : "SELECT p.*, u.nick_name AS nick_name FROM post p INNER JOIN user u ON u.id = p.user_id ORDER BY id DESC";

  if (tagged != null) {
    sql = `SELECT p.*, u.nick_name AS nick_name FROM post p, user u, tag t, post_tag pt WHERE u.id = p.user_id AND t.name = ? AND pt.post_id = p.id ORDER BY id DESC`;
    params = tagged;
  }

  return new Promise(async (resolve, reject) => {
    db.query(sql, params, (err, result) => {
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
                    resolve({
                      posts: result,
                      post_pref: postPrefResult,
                      tags: tagsResult,
                    });
                  }
                }
              );
            } else {
              reject("Couldn't fetch all posts");
            }
          }
        );
      }
    });
  });
};

const postExists = (post_id) => {
  const sql = `SELECT EXISTS(SELECT id FROM post WHERE id = ? LIMIT 1) AS count`;

  return new Promise(async (resolve, reject) => {
    db.query(sql, post_id, (err, result) => {
      if (result.length > 0) {
        resolve(result[0].count);
      } else {
        reject("Couldn't fetch post");
      }
    });
  });
};

const addPost = (question, description, tags, user_id, posted_time, urgent) => {
  const sql = `INSERT INTO post(question, description, user_id, posted_time, urgent) VALUES(?, ?, ?, ?, ?)`;

  return new Promise(async (resolve, reject) => {
    db.query(
      sql,
      [question, description, user_id, posted_time, urgent],
      (err, addResult) => {
        if (tags.length > 0) {
          tags.map((tag) => {
            const sql1 = "SELECT id FROM tag WHERE name = ?";
            db.query(sql1, tag, (err, result) => {
              if (result.length <= 0) {
                db.query(
                  "INSERT INTO tag(name, frequency) VALUES(?, 1)",
                  tag,
                  (err, tagResult) => {
                    db.query(
                      "INSERT INTO post_tag(post_id, tag_id) VALUES(?, ?)",
                      [addResult.insertId, tagResult.insertId]
                    );
                  }
                );
              } else {
                db.query("INSERT INTO post_tag(post_id, tag_id) VALUES(?, ?)", [
                  addResult.insertId,
                  result[0].id,
                ]);
                db.query(
                  "UPDATE tag SET frequency = frequency + 1 WHERE id = ?",
                  result[0].id
                );
              }
            });
          });
        }
        if (!err) {
          resolve({ id: addResult.insertId, message: "post_added" });
        } else {
          reject("Couldn't add post");
        }
      }
    );
  });
};

const deletePost = (post_id) => {
  const sql = `DELETE p.*, r.* FROM post p LEFT JOIN reply r ON r.post_id = p.id WHERE p.id = ?`;

  return new Promise(async (resolve, reject) => {
    db.query(sql, post_id, (err, result) => {
      if (!err) {
        resolve({ message: "success" });
      } else {
        reject("Couldn't delete post");
      }
    });
  });
};

const getSinglePost = (post_id) => {
  const sql = `SELECT p.*, u.nick_name AS nick_name FROM post p INNER JOIN user u ON u.id = p.user_id WHERE p.id = ?`;

  return new Promise(async (resolve, reject) => {
    db.query(sql, post_id, (err, result) => {
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
                    resolve({
                      post: result[0],
                      post_pref: postPrefResult,
                      tags: tagsResult,
                    });
                  } else {
                    reject("Error occured when fetching post_pref");
                  }
                }
              );
            } else {
              reject("Error occured when fetching tags");
            }
          }
        );
      } else {
        reject("Error occured when fetching post");
      }
    });
  });
};

const updatePostStatus = (post_id, status, new_status) => {
  let sql = "UPDATE post SET ";
  if (status == "urgent") {
    sql += "urgent = ?";
  } else if (status == "answered") {
    sql += "answered = ?";
  }
  sql += " WHERE id = ?";

  return new Promise(async (resolve, reject) => {
    db.query(sql, [new_status, post_id], (err, result) => {
      if (!err) {
        resolve({ message: "updated" });
      } else {
        reject("Couldn't update post status");
      }
    });
  });
};

/*
 * Updating post leads and preferences simultaneously
 * when preference is 1, leads increase
 * when preference is 0, leads decrease
 */

const updatePostPreference = (id, post_id, user_id, pref, leads, time) => {
  return new Promise(async (resolve, reject) => {
    db.query(
      "UPDATE post SET leads = leads + ? WHERE id = ?",
      [leads, post_id],
      (err, result) => {
        if (!err) {
          if (id != null) {
            db.query("UPDATE post_pref SET preference = ? WHERE id = ?", [
              pref,
              id,
            ]);
          } else {
            db.query(
              "INSERT INTO post_pref(post_id, user_id, preference) VALUES(?, ?, ?)",
              [post_id, user_id, pref],
              (err, insertResult) => {
                if (!err) {
                  db.query(
                    "SELECT user_id FROM post WHERE id = ?",
                    post_id,
                    (err, result) => {
                      let data;
                      if (result[0].user_id != user_id && leads >= 1 && !err) {
                        data = {
                          user_from_id: user_id,
                          user_to_id: result[0].user_id,
                          type: "UV",
                          post_id: post_id,
                          reply_id: null,
                          child_reply_id: null,
                          description: "up voted your question",
                          time: time,
                        };
                        // resolve({ notif: data });
                        notificationService.addNotification(data);
                      }
                      resolve({ notif: data, id: insertResult.insertId });
                    }
                  );
                } else {
                  reject("An error occured when updating preference");
                }
              }
            );
          }
        }
      }
    );
  });
};

module.exports = {
  postExists,
  addPost,
  deletePost,
  getPosts,
  getSinglePost,
  updatePostStatus,
  updatePostPreference,
};
