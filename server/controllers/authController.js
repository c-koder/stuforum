const express = require("express");

const router = express.Router();
const authService = require("../services/authService");

const { validateToken } = require("../middleware/AuthMiddleware");

/*
 * Using a custom auth middleware to validate a generated authentication token.
 * Comparing whether the stored token is valid once it has been created at an instance of a user login.
 * Returns an object in which contains the decoded token data and are sent to the frontend.
 */

router.get("/", validateToken, async (req, res) => {
  authService
    .authenticateToken(req.user)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.send({ message: error });
    });
});

module.exports = router;
