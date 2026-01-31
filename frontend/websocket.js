import { drawStroke, redrawAll } from "./canvas.js";

export const socket = io({ query: { room: "default" } });

const cursors = {};

socket.on("init", redrawAll);
socket.on("draw", drawStroke);
socket.on("redraw", redrawAll);

socket.on("cursor", ({ x, y, userId }) => {
  let cursor = cursors[userId];
  if (!cursor) {
    cursor = document.createElement("div");
    cursor.className = "cursor";
    document.body.appendChild(cursor);
    cursors[userId] = cursor;
  }
  cursor.style.left = x + "px";
  cursor.style.top = y + "px";
});

socket.on("cursor-remove", (id) => {
  cursors[id]?.remove();
  delete cursors[id];
});
