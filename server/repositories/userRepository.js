const bcrypt = require("bcrypt");

const db = require("../db/db-config");

const getUserByUsernameAndPassword = (username, password) => {
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

const registerNewUser = (
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

const getUserByNickname = (nick_name) => {
  const sql = `SELECT id, full_name, nick_name, student_email, description, avatar, join_date, likes FROM user WHERE nick_name = ?`;

  return new Promise(async (resolve, reject) => {
    db.query(sql, nick_name, (err, result) => {
      if (result.length > 0) {
        resolve(result[0]);
      } else {
        reject("Couldn't get user");
      }
    });
  });
};

const getSortedTopUsers = () => {
  const sql = `SELECT * FROM user WHERE likes > 0 ORDER BY likes DESC LIMIT 5`;

  return new Promise(async (resolve, reject) => {
    db.query(sql, (err, result) => {
      if (result.length > 0) {
        resolve(result);
      } else {
        reject("Couldn't get top users");
      }
    });
  });
};

const getUserPostsCount = (user_id) => {
  const sql = `SELECT COUNT(*) AS count FROM post WHERE user_id = ?`;

  return new Promise(async (resolve, reject) => {
    db.query(sql, user_id, (err, result) => {
      if (result.length > 0) {
        resolve(result);
      } else {
        reject("Couldn't get user posts count");
      }
    });
  });
};

module.exports = {
  getUserByUsernameAndPassword,
  registerNewUser,
  getUserByNickname,
  getSortedTopUsers,
  getUserPostsCount,
};
