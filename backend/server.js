const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const crypto = require("crypto");
const path = require("path");

const {
  createRoom,
  addStroke,
  undoStroke,
  redoStroke,
  getHistory
} = require("./state-manager");

const { getRoomId } = require("./room");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "../frontend")));

io.on("connection", (socket) => {
  const roomId = getRoomId(socket);
  createRoom(roomId);
  socket.join(roomId);

  socket.emit("init", getHistory(roomId));

  socket.on("draw", (stroke) => {
    stroke.id = crypto.randomUUID();
    stroke.userId = socket.id;
    addStroke(roomId, stroke);
    socket.to(roomId).emit("draw", stroke);
  });

  socket.on("undo", () => {
    undoStroke(roomId, socket.id);
    io.to(roomId).emit("redraw", getHistory(roomId));
  });

  socket.on("redo", () => {
    redoStroke(roomId, socket.id);
    io.to(roomId).emit("redraw", getHistory(roomId));
  });

  socket.on("cursor", (data) => {
    data.userId = socket.id;
    socket.to(roomId).emit("cursor", data);
  });

  socket.on("disconnect", () => {
    socket.to(roomId).emit("cursor-remove", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
