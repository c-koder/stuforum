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

const updateUser = async (user) => {
  return userRepository.updateUSer(user);
};

const getTopUsers = async () => {
  return userRepository.getSortedTopUsers();
};

const getUserPostsCount = async (user_id) => {
  return userRepository.getUserPostsCount(user_id);
};

const getUserAnswers = async (user_id) => {
  return userRepository.getUserAnswers(user_id);
};

const getUserNotifications = async (user_id) => {
  return userRepository.getUserNotifications(user_id);
};

const userLogged = async (user_id, logged_in, time) => {
  return userRepository.userLogged(user_id, logged_in, time);
};

module.exports = {
  loginUser,
  registerUser,
  getUser,
  updateUser,
  getTopUsers,
  getUserPostsCount,
  getUserAnswers,
  getUserNotifications,
  userLogged,
};
