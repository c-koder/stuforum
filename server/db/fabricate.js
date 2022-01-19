const createPosts = async (db) => {
  const sql = `CREATE TABLE IF NOT EXISTS post (
    id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    question text NOT NULL,
    description longtext NOT NULL,
    user_id int(11) NOT NULL,
    comments int(11) DEFAULT 0,
    leads int(11) DEFAULT 0,
    posted_time varchar(45) NOT NULL,
    urgent varchar(1) DEFAULT '0',
    answered varchar(1) DEFAULT '0'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

  return new Promise(async (resolve, reject) => {
    db.query(sql, (err, result) => {
      if (!err) {
        resolve();
      } else {
        reject("Couldn't create table");
      }
    });
  });
};

const createPostPrefs = async (db) => {
  const sql = `CREATE TABLE IF NOT EXISTS post_pref (
    id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    post_id int(11) NOT NULL,
    user_id int(11) NOT NULL,
    preference varchar(1) DEFAULT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

  return new Promise(async (resolve, reject) => {
    db.query(sql, (err, result) => {
      if (!err) {
        resolve();
      } else {
        reject("Couldn't create table");
      }
    });
  });
};

const createPostTags = async (db) => {
  const sql = `CREATE TABLE IF NOT EXISTS post_tag (
    id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    post_id int(11) NOT NULL,
    tag_id int(11) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

  return new Promise(async (resolve, reject) => {
    db.query(sql, (err, result) => {
      if (!err) {
        resolve();
      } else {
        reject("Couldn't create table");
      }
    });
  });
};

const createTags = async (db) => {
  const sql = `CREATE TABLE IF NOT EXISTS tag (
    id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    frequency int(11) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

  return new Promise(async (resolve, reject) => {
    db.query(sql, (err, result) => {
      if (!err) {
        resolve();
      } else {
        reject("Couldn't create table");
      }
    });
  });
};

const createReplies = async (db) => {
  const sql = `CREATE TABLE IF NOT EXISTS reply (
    id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    parent_id int(11) DEFAULT NULL,
    user_id int(11) NOT NULL,
    replied_to_id int(11) DEFAULT NULL,
    post_id int(11) NOT NULL,
    replied_time varchar(45) NOT NULL,
    description mediumtext NOT NULL,
    likes int(11) DEFAULT 0,
    dislikes int(11) DEFAULT 0,
    replies varchar(45) DEFAULT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

  return new Promise(async (resolve, reject) => {
    db.query(sql, (err, result) => {
      if (!err) {
        resolve();
      } else {
        reject("Couldn't create table");
      }
    });
  });
};

const createReplyPrefs = async (db) => {
  const sql = `CREATE TABLE IF NOT EXISTS reply_pref (
    id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    reply_id int(11) DEFAULT NULL,
    user_id int(11) NOT NULL,
    preference varchar(1) DEFAULT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

  return new Promise(async (resolve, reject) => {
    db.query(sql, (err, result) => {
      if (!err) {
        resolve();
      } else {
        reject("Couldn't create table");
      }
    });
  });
};

const createUsers = async (db) => {
  const sql = `CREATE TABLE IF NOT EXISTS user (
    id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    full_name varchar(135) NOT NULL,
    nick_name varchar(45) NOT NULL,
    student_id varchar(45) NOT NULL,
    student_email varchar(45) NOT NULL,
    password varchar(255) NOT NULL,
    description text DEFAULT NULL,
    avatar blob DEFAULT NULL,
    join_date varchar(45) NOT NULL,
    likes int(11) DEFAULT 0
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

  return new Promise(async (resolve, reject) => {
    db.query(sql, (err, result) => {
      if (!err) {
        resolve();
      } else {
        reject("Couldn't create table");
      }
    });
  });
};

const createNotifications = async (db) => {
  const sql = `CREATE TABLE IF NOT EXISTS notification (
    id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_from_id int(11) NOT NULL,
    user_to_id int(11) NOT NULL,
    type varchar(2) NOT NULL,
    post_id int(11) DEFAULT NULL,
    reply_id int(11) DEFAULT NULL,
    description varchar(90) NOT NULL,
    time varchar(45) NOT NULL,
    viewed varchar(1) DEFAULT '0'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

  return new Promise(async (resolve, reject) => {
    db.query(sql, (err, result) => {
      if (!err) {
        resolve();
      } else {
        reject("Couldn't create table");
      }
    });
  });
};

const createLoggedUsers = async (db) => {
  const sql = `CREATE TABLE IF NOT EXISTS logged_user (
    id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id int(11) NOT NULL,
    logged_in varchar(1) DEFAULT 1,
    time varchar(55) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

  return new Promise(async (resolve, reject) => {
    db.query(sql, (err, result) => {
      if (!err) {
        resolve();
      } else {
        reject("Couldn't create table");
      }
    });
  });
};

const dropTable = async (db, table) => {
  const sql = `DROP TABLE ${table}`;

  return new Promise(async (resolve, reject) => {
    db.query(sql, (err, result) => {
      if (!err) {
        resolve();
      } else {
        reject("Couldn't drop table");
      }
    });
  });
};

const create = async (db) => {
  createPosts(db);
  createPostPrefs(db);
  createPostTags(db);
  createTags(db);
  createReplies(db);
  createReplyPrefs(db);
  createUsers(db);
  createNotifications(db);
  createLoggedUsers(db)
};

const drop = async (db) => {
  dropTable(db, "post");
  dropTable(db, "post_pref");
  dropTable(db, "post_tag");
  dropTable(db, "tag");
  dropTable(db, "reply");
  dropTable(db, "reply_pref");
  dropTable(db, "user");
  dropTable(db, "notification");
  dropTable(db, "logged_user");
};

module.exports = {
  create,
  drop,
};
