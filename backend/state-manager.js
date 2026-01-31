const rooms = {};

function createRoom(roomId) {
  if (!rooms[roomId]) {
    rooms[roomId] = {
      strokes: [],
      redoStacks: {}
    };
  }
}

function addStroke(roomId, stroke) {
  rooms[roomId].strokes.push(stroke);
}

function undoStroke(roomId, userId) {
  const strokes = rooms[roomId].strokes;
  for (let i = strokes.length - 1; i >= 0; i--) {
    if (strokes[i].userId === userId) {
      rooms[roomId].redoStacks[userId] ??= [];
      rooms[roomId].redoStacks[userId].push(strokes[i]);
      strokes.splice(i, 1);
      break;
    }
  }
}

function redoStroke(roomId, userId) {
  const redoStack = rooms[roomId].redoStacks[userId];
  if (redoStack && redoStack.length) {
    rooms[roomId].strokes.push(redoStack.pop());
  }
}

function getHistory(roomId) {
  return rooms[roomId].strokes;
}

module.exports = {
  createRoom,
  addStroke,
  undoStroke,
  redoStroke,
  getHistory
};
