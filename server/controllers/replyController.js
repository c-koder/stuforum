const express = require("express");

const router = express.Router();
const replyService = require("../services/replyService");

router.post("/getreplies", async (req, res) => {
  replyService
    .getReplies(req.body.post_id)
    .then((replies) => {
      res.send(replies);
    })
    .catch((error) => {
      res.send({ message: error });
    });
});

router.post("/getreplypref", async (req, res) => {
  replyService
    .getReplyPreference(req.body.user_id, req.body.reply_id)
    .then((preference) => {
      res.send(preference);
    })
    .catch((error) => {
      res.send({ message: error });
    });
});

router.post("/addreply", async (req, res) => {
  replyService
    .addReply(
      req.body.parent_id,
      req.body.user_id,
      req.body.replied_to,
      req.body.post_id,
      req.body.replied_time,
      req.body.description
    )
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      res.send({ message: error });
    });
});

router.post("/deletereply", async (req, res) => {
  replyService
    .deleteReply(
      req.body.post_id,
      req.body.reply_id,
      req.body.delete_child_only
    )
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      res.send({ message: error });
    });
});

router.post("/updatereplypref", async (req, res) => {
  replyService
    .updateReplyPreference(
      req.body.id,
      req.body.reply_id,
      req.body.parent_id,
      req.body.user_id,
      req.body.post_id,
      req.body.pref,
      req.body.previous_pref,
      req.body.reply_posted_user_id,
      req.body.time
    )
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      res.send({ message: error });
    });
});

module.exports = router;
