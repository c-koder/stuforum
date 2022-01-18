const authRepository = require("../repositories/authRepository");

const authenticateToken = async (user) => {
  return authRepository.authenticateToken(user);
};

module.exports = {
  authenticateToken,
};
