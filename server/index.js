const express = require("express");
const cors = require("cors");
const app = express();

const user = require("./controllers/userController");
const post = require("./controllers/postController");
const tag = require("./controllers/tagController");
const reply = require("./controllers/replyController");
const auth = require("./controllers/authController");

app.use(cors());
app.use(express.json());

app.use("/user", user);
app.use("/post", post);
app.use("/tag", tag);
app.use("/reply", reply);
app.use("/auth", auth);

app.listen(3001, () => {
  console.log("Server Running on Port: 3001");
});
