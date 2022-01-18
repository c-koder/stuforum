const notificationRepository = require("../repositories/notificationRepository");

const addNotification = async (data) => {
  return notificationRepository.addNotification(data);
};

module.exports = {
  addNotification,
};
