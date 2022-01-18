const replyRepository = require("../repositories/replyRepository");

const getReplies = async (post_id) => {
  return replyRepository.getReplies(post_id);
};

const getReplyPreference = async (user_id, reply_id) => {
  return replyRepository.getReplyPreference(user_id, reply_id);
};

const addReply = async (
  parent_id,
  user_id,
  replied_to,
  post_id,
  replied_time,
  description
) => {
  return replyRepository.addReply(
    parent_id,
    user_id,
    replied_to,
    post_id,
    replied_time,
    description
  );
};

const deleteReply = async (post_id, reply_id, delete_child_only) => {
  return replyRepository.deleteReply(post_id, reply_id, delete_child_only);
};

const updateReplyPreference = async (
  id,
  reply_id,
  parent_id,
  user_id,
  post_id,
  pref,
  previous_pref,
  reply_posted_user_id,
  time
) => {
  return replyRepository.updateReplyPreference(
    id,
    reply_id,
    parent_id,
    user_id,
    post_id,
    pref,
    previous_pref,
    reply_posted_user_id,
    time
  );
};

module.exports = {
  getReplies,
  getReplyPreference,
  addReply,
  deleteReply,
  updateReplyPreference,
};
