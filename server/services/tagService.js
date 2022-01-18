const tagRepository = require("../repositories/tagRepository");

const getAllTags = async () => {
  return tagRepository.getAllTags();
};

const getFrequentlyUsedTags = async () => {
  return tagRepository.getFrequentlyUsedTags();
};

module.exports = {
  getAllTags,
  getFrequentlyUsedTags,
};
