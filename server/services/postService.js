const postRepository = require("../repositories/postRepository");

const getAllPosts = async (user_id, user_posts, tagged) => {
  return postRepository.getPosts(user_id, user_posts, tagged);
};

const doesPostExist = async (post_id) => {
  return postRepository.postExists(post_id);
};

const addPost = async (
  question,
  description,
  tags,
  user_id,
  posted_time,
  urgent
) => {
  return postRepository.addPost(
    question,
    description,
    tags,
    user_id,
    posted_time,
    urgent
  );
};

const deletePost = async (post_id) => {
  return postRepository.deletePost(post_id);
};

const getSinglePost = async (post_id) => {
  return postRepository.getSinglePost(post_id);
};

const updatePostStatus = async (post_id, status, new_status) => {
  return postRepository.updatePostStatus(post_id, status, new_status);
};

const updatePostPreference = async (
  id,
  post_id,
  user_id,
  pref,
  leads,
  time
) => {
  return postRepository.updatePostPreference(
    id,
    post_id,
    user_id,
    pref,
    leads,
    time
  );
};

module.exports = {
  doesPostExist,
  addPost,
  deletePost,
  getAllPosts,
  getSinglePost,
  updatePostStatus,
  updatePostPreference,
};
