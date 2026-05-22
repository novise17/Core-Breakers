console.log("Echoes of Asherya - V1 Running");

import { Fighter } from "./fighters/fighter.js";

// CANVAS
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 600;

// INPUT
const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

// PLAYERS
const player1 = new Fighter("Blaze", 150, "red", {
  left: "a",
  right: "d",
  jump: "w",
  attack: "z"
});

const player2 = new Fighter("Frost", 700, "cyan", {
  left: "ArrowLeft",
  right: "ArrowRight",
  jump: "ArrowUp",
  attack: "Enter"
});

// GAME LOOP
function loop() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ground
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 560, canvas.width, 40);

  // UPDATE
  player1.update(keys, canvas, player2);
  player2.update(keys, canvas, player1);

  // DRAW
  player1.draw(ctx);
  player2.draw(ctx);

  // UI
  ctx.fillStyle = "white";
  ctx.fillText(`P1 HP: ${player1.hp}`, 20, 20);
  ctx.fillText(`P2 HP: ${player2.hp}`, 880, 20);

  requestAnimationFrame(loop);
}

loop();
