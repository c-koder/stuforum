const authenticateToken = (user) => {
  return new Promise(async (resolve, reject) => {
    resolve(user);
  });
};

module.exports = {
  authenticateToken,
};
