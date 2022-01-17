const userRepository = require("../repositories/userRepository");

const loginUser = async (username, password) => {
  return userRepository.getUserByUsernameAndPassword(username, password);
};

const registerUser = async (
  full_name,
  nick_name,
  student_id,
  student_email,
  password,
  join_date
) => {
  return userRepository.registerNewUser(
    full_name,
    nick_name,
    student_id,
    student_email,
    password,
    join_date
  );
};

const getUser = async (nick_name) => {
  return userRepository.getUserByNickname(nick_name);
};

const getTopUsers = async () => {
  return userRepository.getSortedTopUsers();
};

const getUserPostsCount = async (user_id) => {
  return userRepository.getUserPostsCount(user_id);
};

module.exports = {
  loginUser,
  registerUser,
  getUser,
  getTopUsers,
  getUserPostsCount,
};
