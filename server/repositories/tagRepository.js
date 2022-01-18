const db = require("../db/db-config");

const getAllTags = () => {
  const sql = `SELECT * FROM tag ORDER BY name`;

  return new Promise(async (resolve, reject) => {
    db.query(sql, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject("Couldn't fetch tags");
      }
    });
  });
};

const getFrequentlyUsedTags = () => {
  const sql = `SELECT * FROM tag WHERE frequency > 0 ORDER BY frequency DESC LIMIT 3`;

  return new Promise(async (resolve, reject) => {
    db.query(sql, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject("Couldn't fetch frequently used tags");
      }
    });
  });
};

module.exports = {
  getAllTags,
  getFrequentlyUsedTags,
};
