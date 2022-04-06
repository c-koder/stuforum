const express = require("express");

const jwt = require("jsonwebtoken");
const router = express.Router();
const userService = require("../services/userService");
const notificationService = require("../services/notificationService");

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
      userService.userLogged(user.id, 1, req.body.time).catch((error) => {
        res.send({ message: error });
      });
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

router.post("/logout", async (req, res) => {
  userService.userLogged(req.body.user_id, 0, req.body.time).catch((error) => {
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

router.post("/updateuser", async (req, res) => {
  userService
    .updateUser(req.body)
    .then((message) => {
      res.send({ message: message });
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

router.post("/getanswers", async (req, res) => {
  userService
    .getUserAnswers(req.body.user_id)
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      res.send({ message: error });
    });
});

router.post("/getnotifications", async (req, res) => {
  userService
    .getUserNotifications(req.body.user_id)
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      res.send({ message: error });
    });
});

router.post("/notificationviewed", async (req, res) => {
  notificationService
    .updateNotificationViewed(req.body.id)
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      res.send({ message: error });
    });
});

router.post("/allnotificationsviewed", async (req, res) => {
  notificationService
    .updateAllNotificationsViewed(req.body.user_id)
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      res.send({ message: error });
    });
});

router.post("/deletenotification", async (req, res) => {
  notificationService
    .removeNotification(req.body.id)
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      res.send({ message: error });
    });
});

module.exports = router;
