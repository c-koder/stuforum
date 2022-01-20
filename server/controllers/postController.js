const express = require("express");

const router = express.Router();
const postService = require("../services/postService");

router.post("/getposts", async (req, res) => {
  postService
    .getAllPosts(req.body.user_id, req.body.user_posts, req.body.tagged)
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      res.send({ message: error });
    });
});

router.post("/postexists", async (req, res) => {
  postService
    .doesPostExist(req.body.post_id)
    .then((count) => {
      count == 1
        ? res.send({ message: "exists" })
        : res.send({ message: null });
    })
    .catch((error) => {
      res.send({ message: error });
    });
});

router.post("/addpost", async (req, res) => {
  const urgent = req.body.urgent ? 1 : 0;

  postService
    .addPost(
      req.body.question,
      req.body.description,
      req.body.tags,
      req.body.user_id,
      req.body.posted_time,
      urgent
    )
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      res.send({ message: error });
    });
});

router.post("/deletepost", async (req, res) => {
  postService
    .deletePost(req.body.post_id)
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      res.send({ message: error });
    });
});

router.post("/getsinglepost", async (req, res) => {
  postService
    .getSinglePost(req.body.post_id)
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      res.send({ message: error });
    });
});

router.post("/getminiposts", async (req, res) => {
  postService
    .getMiniPosts(req.body.count)
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      res.send({ message: error });
    });
});

router.post("/searchpost", async (req, res) => {
  postService
    .searchForPosts(req.body.arg)
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      res.send({ message: error });
    });
});

router.post("/updatepoststatus", async (req, res) => {
  const new_status = req.body.new_status == 0 ? 1 : 0;

  postService
    .updatePostStatus(req.body.post_id, req.body.status, new_status)
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      res.send({ message: error });
    });
});

router.post("/updateleadsprefs", async (req, res) => {
  postService
    .updatePostPreference(
      req.body.id,
      req.body.post_id,
      req.body.user_id,
      req.body.pref,
      req.body.leads,
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
