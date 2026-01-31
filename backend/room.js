function getRoomId(socket) {
  return socket.handshake.query.room || "default";
}

module.exports = { getRoomId };
