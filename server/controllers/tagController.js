const express = require("express");

const router = express.Router();
const tagService = require("../services/tagService");

router.get("/getalltags", async (req, res) => {
  tagService
    .getAllTags()
    .then((tags) => {
      res.send(tags);
    })
    .catch((error) => {
      res.send({ message: error });
    });
});

router.get("/getsortedtags", async (req, res) => {
  tagService
    .getFrequentlyUsedTags()
    .then((tags) => {
      res.send(tags);
    })
    .catch((error) => {
      res.send({ message: error });
    });
});

module.exports = router;
