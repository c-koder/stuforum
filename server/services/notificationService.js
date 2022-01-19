const notificationRepository = require("../repositories/notificationRepository");

const addNotification = async (data) => {
  return notificationRepository.addNotification(data);
};

const getNotification = async (user_from_id, user_to_id, time) => {
  return notificationRepository.getNotification(user_from_id, user_to_id, time);
};

module.exports = {
  addNotification,
  getNotification,
};
