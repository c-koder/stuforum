const authenticateToken = async (user) => {
  return new Promise(async (resolve, reject) => {
    resolve(user);
  });
};

module.exports = {
  authenticateToken,
};
