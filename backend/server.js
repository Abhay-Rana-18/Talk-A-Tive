const express = require("express");
const colors = require("colors");
const { chats } = require("./data/data");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const app = express();
const port = 5000;
const cors = require("cors");

const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");

const { Server } = require("socket.io");

connectDB();

app.use(express.json()); // for accepting json data.
// app.get('/', (req, res)=>{
//     res.send("let's go!");
// });

app.use("/api/user/", userRoutes);
app.use("/api/chat/", chatRoutes);
app.use("/api/message/", messageRoutes);

// -------------------------------DEPLOYMENT----------------------------------
const __dirname1 = path.resolve();
if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running succesfully!");
  });
}
// -------------------------------DEPLOYMENT----------------------------------

// 404 not found
app.use(notFound);
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`App sucessfully started at port ${port}`.blue.bold);
});

// app.use(cors({ origin: ['localhost:3000', '192.168.43.143:3000'] }));
// Access-Control-Allow-Origin: "localhost:3000", "talk-a-tive-qnvy.onrender.com",  "192.168.43.143:3000";
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: [
      // "localhost:3000",
      // "192.168.43.143:3000",
      "talk-a-tive-qnvy.onrender.com"
    ],
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log(userData.name);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  // new feature

  // socket.on("type", (msg, user) => {
  //   socket.in(user._id).emit("whatType", msg);
  // });

  // socket.on("new message", (msg) => {
  //   var chat = msg.chat;
  //   if (!chat.users) {
  //     return console.log("Chat users not defined.");
  //   }

  //   chat.users.forEach((user) => {
  //     if (user._id == msg.sender._id) return;

  //     socket.in(user._id).emit("message received", msg);
  //   });
  // });

  socket.off("setup", () => {
    console.log("USER disconnected!");
    socket.leave(userData_id);
  });
});
