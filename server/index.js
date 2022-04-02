const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const user = require("./controllers/userController");
const post = require("./controllers/postController");
const tag = require("./controllers/tagController");
const reply = require("./controllers/replyController");
const auth = require("./controllers/authController");

const notificationService = require("./services/notificationService");

app.use(cors());
app.use(express.json());

app.use("/api/user", user);
app.use("/api/post", post);
app.use("/api/tag", tag);
app.use("/api/reply", reply);
app.use("/api/auth", auth);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("registerId", (id) => {
    socket.join(id);
  });

  socket.on("userLoggedOut", (id) => {
    socket.leave(id);
  });

  socket.on("disconnect", () => {
    // console.log(socket.id + " got disconnected");
  });

  socket.on("send_notification", async (data) => {
    notificationService
      .getNotification(data.user_from_id, data.user_to_id, data.time)
      .then((notifcation) => {
        socket
          .to(notifcation.user_to_id)
          .emit("receive_notification", notifcation);
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server Running on Port: ${PORT}`);
});
