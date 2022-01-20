const db = require("../db/db-config");

/* types
 * UV - up voted
 * LK - liked
 * CM - commented
 */

const addNotification = async (data) => {
  let sql =
    "INSERT INTO notification(user_from_id, user_to_id, type, post_id, reply_id, description, time) SELECT ?, ?, ?, ?, ?, ?, ? FROM DUAL WHERE NOT EXISTS (SELECT id FROM notification WHERE user_from_id = ? AND user_to_id = ? AND type = ? ";

  let params = [
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
  ];

  if (data.type == "CM") {
    sql += "AND time = ?)";
    params.push(data.time);
  } else {
    sql += "AND reply_id = ?)";
    params.push(data.reply_id);
  }

  return new Promise(async (resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (!err) {
        resolve();
      } else {
        reject("Couldn't add notification");
      }
    });
  });
};

const getNotification = async (user_from_id, user_to_id, time) => {
  const sql =
    "SELECT n.*, u.nick_name AS user_from FROM notification n, user u WHERE user_from_id = ? AND user_to_id = ? AND time = ? AND n.user_from_id = u.id";

  return new Promise(async (resolve, reject) => {
    db.query(sql, [user_from_id, user_to_id, time], (err, result) => {
      if (!err) {
        resolve(result[0]);
      } else {
        reject("Couldn't fetch notification");
      }
    });
  });
};

const updateNotificationViewed = async (id) => {
  const sql = "UPDATE notification SET viewed = 1 WHERE id = ?";

  return new Promise(async (resolve, reject) => {
    db.query(sql, id, (err, result) => {
      if (!err) {
        resolve();
      } else {
        reject("Couldn't update notification");
      }
    });
  });
};

const updateAllNotificationsViewed = async (user_id) => {
  const sql = "UPDATE notification SET viewed = 1 WHERE user_to_id = ?";

  return new Promise(async (resolve, reject) => {
    db.query(sql, user_id, (err, result) => {
      if (!err) {
        resolve();
      } else {
        reject("Couldn't update notifications");
      }
    });
  });
};

const removeNotification = async (id) => {
  const sql = "DELETE FROM notification WHERE id = ?";

  return new Promise(async (resolve, reject) => {
    db.query(sql, id, (err, result) => {
      if (!err) {
        resolve();
      } else {
        reject("Couldn't delete notification");
      }
    });
  });
};

module.exports = {
  addNotification,
  getNotification,
  updateNotificationViewed,
  updateAllNotificationsViewed,
  removeNotification,
};
