const notificationRepository = require("../repositories/notificationRepository");

const addNotification = async (data) => {
  return notificationRepository.addNotification(data);
};

const getNotification = async (user_from_id, user_to_id, time) => {
  return notificationRepository.getNotification(user_from_id, user_to_id, time);
};

const updateNotificationViewed = async (id) => {
  return notificationRepository.updateNotificationViewed(id);
};

const updateAllNotificationsViewed = async (user_id) => {
  return notificationRepository.updateAllNotificationsViewed(user_id);
};

const removeNotification = async (id) => {
  return notificationRepository.removeNotification(id);
};

module.exports = {
  addNotification,
  getNotification,
  removeNotification,
  updateNotificationViewed,
  updateAllNotificationsViewed,
};
