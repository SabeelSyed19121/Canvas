import { canvas, drawStroke, getCoords } from "./canvas.js";
import { socket } from "./websocket.js";

let drawing = false;
let prev = null;
let pending = null;

function start(e) {
  drawing = true;
  prev = getCoords(e.touches ? e.touches[0] : e);
}

function move(e) {
  if (!drawing) return;
  pending = e.touches ? e.touches[0] : e;
}

function end() {
  drawing = false;
  prev = null;
}

function loop() {
  if (pending && prev) {
    const curr = getCoords(pending);
    const stroke = {
      start: prev,
      end: curr,
      color: "black",
      width: 4
    };
    drawStroke(stroke);
    socket.emit("draw", stroke);
    socket.emit("cursor", { x: pending.clientX, y: pending.clientY });
    prev = curr;
    pending = null;
  }
  requestAnimationFrame(loop);
}

canvas.addEventListener("mousedown", start);
canvas.addEventListener("mousemove", move);
canvas.addEventListener("mouseup", end);

canvas.addEventListener("touchstart", start);
canvas.addEventListener("touchmove", move);
canvas.addEventListener("touchend", end);

document.getElementById("undo").onclick = () => socket.emit("undo");
document.getElementById("redo").onclick = () => socket.emit("redo");

loop();
