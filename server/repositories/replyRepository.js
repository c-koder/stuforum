const db = require("../db/db-config");

const notificationService = require("../services/notificationService");

const getReplies = (post_id) => {
  const sql = `SELECT r.*, u.nick_name AS nick_name, u2.nick_name AS replied_to FROM reply r LEFT JOIN user u ON u.id = r.user_id LEFT JOIN user u2 ON u2.id = r.replied_to_id WHERE r.post_id = ? ORDER BY r.id DESC`;

  return new Promise(async (resolve, reject) => {
    db.query(sql, post_id, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject("Couldn't fetch replies");
      }
    });
  });
};

const getReplyPreference = (user_id, reply_id) => {
  const sql = `SELECT * FROM reply_pref WHERE user_id = ? AND reply_id = ?`;

  return new Promise(async (resolve, reject) => {
    db.query(sql, [user_id, reply_id], (err, result) => {
      if (!err) {
        resolve(result[0]);
      } else {
        reject("Couldn't fetch reply preference");
      }
    });
  });
};

const addReply = (
  parent_id,
  user_id,
  replied_to,
  post_id,
  replied_time,
  description
) => {
  const sql = `INSERT INTO reply(parent_id, user_id, replied_to_id, post_id, replied_time, description) VALUES(?, ?, ?, ?, ?, ?)`;

  return new Promise(async (resolve, reject) => {
    db.query(
      sql,
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
                notificationService.addNotification(data);
              }
            }
          );
          if (replied_to != null) {
            db.query(
              "SELECT u.nick_name FROM user u, reply r WHERE u.id = ? AND r.id = ?",
              [replied_to, result.insertId],
              (err, repliedToResult) => {
                resolve({
                  id: result.insertId,
                  replied_to: repliedToResult[0].nick_name,
                });
              }
            );
          } else {
            resolve({
              id: result.insertId,
              replied_to: null,
            });
          }
        } else {
          reject("Couldnt insert reply");
        }
      }
    );
  });
};

const deleteReply = (post_id, reply_id, delete_child_only) => {
  let sql = "DELETE FROM reply WHERE id = ?";
  let sql1 = "UPDATE post SET comments = comments - ";

  let params = [reply_id];
  let params1;

  if (!delete_child_only) {
    sql += " OR parent_id = ?";
    params.push(reply_id);
    sql1 += "? WHERE id = ?";
  } else {
    sql1 += "1 WHERE id = ?";
    params1 = [post_id];
  }

  return new Promise(async (resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (!err) {
        if (!delete_child_only) params1 = [result.affectedRows, post_id];
        db.query(sql1, params1);
        resolve();
      } else {
        reject("Couldn't delete reply");
      }
    });
  });
};

const updateReplyPreference = (
  id,
  reply_id,
  parent_id,
  user_id,
  post_id,
  pref,
  previous_pref,
  reply_posted_user_id,
  time
) => {
  let updateLikesDislikesQuery = "UPDATE reply SET ";
  let updateUserLikes = "UPDATE user SET ";

  return new Promise(async (resolve, reject) => {
    if (id != null) {
      db.query("UPDATE reply_pref SET preference = ? WHERE id = ?", [pref, id]);
      resolve();
    } else {
      db.query(
        "INSERT INTO reply_pref(reply_id, user_id, preference) VALUES(?, ?, ?)",
        [reply_id, user_id, pref]
      );
      resolve();
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
          notificationService.addNotification(data);
        }
      }
    );
  });
};

module.exports = {
  getReplies,
  getReplyPreference,
  addReply,
  deleteReply,
  updateReplyPreference,
};
