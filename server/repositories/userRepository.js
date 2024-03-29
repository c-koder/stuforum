const bcrypt = require("bcrypt");

const db = require("../db/db-config");

const getUserByUsernameAndPassword = async (username, password) => {
  const sql = `SELECT * FROM user WHERE nick_name = ? OR student_id = ? OR student_email = ?`;

  return new Promise(async (resolve, reject) => {
    db.query(sql, [username, username, username], async (err, result) => {
      if (result.length > 0) {
        if (bcrypt.compareSync(password, result[0].password)) {
          resolve(result[0]);
        } else {
          reject("User authentication failed");
        }
      } else {
        reject("User authentication failed");
      }
    });
  });
};

const registerNewUser = async (
  full_name,
  nick_name,
  student_id,
  student_email,
  password,
  join_date
) => {
  let sql1 =
    "SELECT * FROM user WHERE nick_name = ? OR student_email = ? OR student_id = ?";

  return new Promise(async (resolve, reject) => {
    db.query(
      sql1,
      [nick_name, student_email, student_id],
      async (err, result) => {
        if (result.length > 0) {
          reject("User already exists");
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);
          let sql2 =
            "INSERT INTO user(full_name, nick_name, student_id, student_email, password, join_date) VALUES (?, ?, ?, ?, ?, ?)";
          db.query(
            sql2,
            [
              full_name,
              nick_name,
              student_id,
              student_email,
              hashedPassword,
              join_date,
            ],
            async (err, result) => {
              if (err) {
                reject("Couldn't add user");
              } else {
                resolve();
              }
            }
          );
        }
      }
    );
  });
};

const getUserByNickname = async (nick_name) => {
  const sql = `SELECT id, full_name, nick_name, student_email, description, avatar, join_date, likes FROM user WHERE nick_name = ?`;

  return new Promise(async (resolve, reject) => {
    db.query(sql, nick_name, (err, result) => {
      if (!err) {
        resolve(result[0]);
      } else {
        reject("Couldn't get user");
      }
    });
  });
};

const userLogged = async (user_id, logged_in, time) => {
  const sql = `INSERT INTO logged_user(user_id, logged_in, time) VALUES(?, ?, ?)`;

  return new Promise(async (resolve, reject) => {
    db.query(sql, [user_id, logged_in, time], async (err, result) => {
      if (!err) {
        resolve();
      } else {
        reject("Couldn't insert logged_user");
      }
    });
  });
};

const updateUSer = async (user) => {
  let sql1 = "SELECT * FROM user WHERE nick_name = ? AND NOT id = ?";
  return new Promise(async (resolve, reject) => {
    db.query(sql1, [user.nickname, user.id], (err, result) => {
      if (result.length > 0) {
        reject("Nickname already in-use.");
      } else {
        let sql2 = "SELECT * FROM user WHERE student_email = ? AND NOT id = ?";
        db.query(sql2, [user.email, user.id], (err, result) => {
          if (result.length > 0) {
            reject("Email already in-use.");
          } else {
            let sql3 = "SELECT * FROM user WHERE id = ?";
            db.query(sql3, user.id, (err, result) => {
              if (result.length > 0) {
                if (!bcrypt.compareSync(user.password, result[0].password)) {
                  reject("Password didn't match.");
                } else {
                  const sql4 = `UPDATE user SET full_name = ?, nick_name = ?, student_email = ?, description = ? WHERE id = ?`;
                  db.query(
                    sql4,
                    [
                      user.fullname,
                      user.nickname,
                      user.email,
                      user.bio,
                      user.id,
                    ],
                    (err, result) => {
                      if (!err) {
                        resolve("profile_updated");
                      } else {
                        reject(
                          "An unknown error occured, please try again later."
                        );
                      }
                    }
                  );
                }
              } else {
                reject("An unknown error occured, please try again later.");
              }
            });
          }
        });
      }
    });
  });
};

const getSortedTopUsers = async () => {
  const sql = `SELECT * FROM user WHERE likes > 0 ORDER BY likes DESC LIMIT 5`;

  return new Promise(async (resolve, reject) => {
    db.query(sql, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject("Couldn't get top users");
      }
    });
  });
};

const getUserPostsCount = async (user_id) => {
  const sql = `SELECT COUNT(*) AS count FROM post WHERE user_id = ?`;

  return new Promise(async (resolve, reject) => {
    db.query(sql, user_id, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject("Couldn't get user posts count");
      }
    });
  });
};

const getUserAnswers = async (user_id) => {
  const sql = `SELECT p.*, u.nick_name AS nick_name FROM post p JOIN reply r ON r.post_id = p.id AND r.user_id = ? INNER JOIN user u ON u.id = p.user_id WHERE NOT p.user_id = ? GROUP BY p.id ORDER BY p.id DESC`;

  return new Promise(async (resolve, reject) => {
    db.query(sql, [user_id, user_id], (err, postResults) => {
      if (postResults.length > 0) {
        db.query(
          "SELECT r.*, u.nick_name AS nick_name FROM reply r, user u, post p  WHERE r.id IN (SELECT MAX(id) AS MaxId FROM reply WHERE parent_id IS NULL GROUP BY post_id) AND u.id = r.user_id AND r.user_id = ? AND NOT p.user_id = ?",
          [user_id, user_id],
          (err, replyResults) => {
            if (!err) {
              db.query(
                "SELECT * FROM tag INNER JOIN post_tag ON post_tag.tag_id = tag.id AND post_tag.post_id IN(SELECT p.id FROM post p, user u WHERE u.id = p.user_id)",
                (err, tagsResult) => {
                  if (!err) {
                    db.query(
                      "SELECT * FROM post_pref pp WHERE post_id IN (SELECT p.id FROM post p, user u WHERE u.id = p.user_id) AND user_id = ?",
                      user_id,
                      (err, postPrefResult) => {
                        if (!err) {
                          resolve({
                            posts: postResults,
                            replies: replyResults,
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
      } else {
        reject("Couldn't fetch answers");
      }
    });
  });
};

const getUserNotifications = async (user_id) => {
  const sql = `SELECT n.*, u.nick_name AS user_from, u2.nick_name AS user_to FROM notification n LEFT JOIN user u ON u.id = n.user_from_id LEFT JOIN user u2 ON u2.id = n.user_to_id WHERE user_to_id = ? ORDER BY id DESC`;

  return new Promise(async (resolve, reject) => {
    db.query(sql, user_id, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject("Couldn't fetch notifications");
      }
    });
  });
};

module.exports = {
  getUserByUsernameAndPassword,
  registerNewUser,
  getUserByNickname,
  updateUSer,
  getSortedTopUsers,
  getUserPostsCount,
  getUserAnswers,
  getUserNotifications,
  userLogged,
};
