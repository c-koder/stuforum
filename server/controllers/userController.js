const express = require("express");

const jwt = require("jsonwebtoken");
const router = express.Router();
const userService = require("../services/userService");

router.post("/login", async (req, res) => {
  userService
    .loginUser(req.body.username, req.body.password)
    .then((user) => {
      const accessToken = jwt.sign(
        {
          nick_name: user.nick_name,
          id: user.id,
        },
        "murofuts",
        {
          expiresIn: 60 * 60 * 72,
        }
      );
      res.send({
        token: accessToken,
        nick_name: user.nick_name,
        id: user.id,
      });
    })
    .catch((error) => {
      res.send({ message: error });
    });
});

router.post("/register", async (req, res) => {
  userService
    .registerUser(
      req.body.full_name,
      req.body.nick_name,
      req.body.student_id,
      req.body.student_email,
      req.body.password,
      req.body.join_date
    )
    .then((message) => {
      res.send({ message: message });
    })
    .catch((error) => {
      res.send({ message: error });
    });
});

router.post("/getuser", async (req, res) => {
  userService
    .getUser(req.body.nick_name)
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      res.send({ message: error });
    });
});

router.get("/getsortedusers", async (req, res) => {
  userService
    .getTopUsers()
    .then((users) => {
      res.send(users);
    })
    .catch((error) => {
      res.send({ message: error });
    });
});

router.post("/getuserpostcount", async (req, res) => {
  userService
    .getUserPostsCount(req.body.user_id)
    .then((count) => {
      res.send(count);
    })
    .catch((error) => {
      res.send({ message: error });
    });
});

module.exports = router;
