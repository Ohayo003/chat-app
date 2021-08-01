const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
});

let users = [];

const checkThenUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeDisconnectedUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUserIdFromUsers = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("user connected.");

  //take and check the socket.id and userId from user
  socket.on("user", (userId) => {
    checkThenUser(userId, socket.id);
    io.emit("users", users);
  });

  //send message and receive message
  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const user = getUserIdFromUsers(receiverId);
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      message,
    });
  });

  //remove socketId from user if the user disconnects or disconnected
  socket.on("disconnect", () => {
    console.log("user disconnected");
    removeDisconnectedUser(socket.id);
    io.emit("users",users);
  });
});
