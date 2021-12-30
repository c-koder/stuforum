const { verify } = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  const accessToken = req.header("accessToken");
  if (!accessToken) return res.json({ error: "user_not_logged" });
  try {
    const validToken = verify(accessToken, "murofuts");
    req.user = validToken;
    next();
  } catch (err) {
    return res.json({ error: err });
  }
};

module.exports = { validateToken };
