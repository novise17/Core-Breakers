// ============================================
// FILE: main.js
// ============================================

import { Fighter } from "./fighters/Fighter.js";

import { MatchManager } from "./engine/matchManager.js";

import {
    applyShake
} from "./vfx/screenShake.js";

import {
    updateParticles
} from "./vfx/particleSystem.js";

// ============================================
// CANVAS
// ============================================

const canvas = document.getElementById("gameCanvas");

const ctx = canvas.getContext("2d");

canvas.width = 1200;

canvas.height = 600;

// ============================================
// PLAYERS
// ============================================

const player1 = new Fighter("Blaze", 200, "red", {
    left: "a",
    right: "d",
    jump: "w",
    attack: " "
});

const player2 = new Fighter("Volt", 900, "blue", {
    left: "ArrowLeft",
    right: "ArrowRight",
    jump: "ArrowUp",
    attack: "Enter"
});

// ============================================
// MATCH SYSTEM
// ============================================

const match = new MatchManager(player1, player2);

// ============================================
// INPUT
// ============================================

const keys = {};

window.addEventListener("keydown", (e) => {

    keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {

    keys[e.key] = false;
});

// ============================================
// UPDATE
// ============================================

function update() {

    match.update();

    if (!match.roundOver && !match.matchOver) {

        player1.move(keys, canvas);

        player2.move(keys, canvas);

        if (keys[player1.controls.attack]) {

            player1.attack(player2);
        }

        if (keys[player2.controls.attack]) {

            player2.attack(player1);
        }
    }
}

// ============================================
// DRAW
// ============================================

function draw() {

    ctx.save();

    applyShake(ctx);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // FLOOR
    ctx.fillStyle = "#222";

    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

    // PLAYERS
    player1.draw(ctx);

    player2.draw(ctx);

    // PROJECTILES
    player1.updateProjectiles(ctx, player2);

    player2.updateProjectiles(ctx, player1);

    updateParticles(ctx);

    drawUI();

    ctx.restore();
}

// ============================================
// UI
// ============================================

function drawUI() {

    // HEALTH
    ctx.fillStyle = "red";
    ctx.fillRect(20, 20, player1.health * 3, 20);

    ctx.fillStyle = "blue";
    ctx.fillRect(canvas.width - player2.health * 3 - 20, 20, player2.health * 3, 20);

    // TIMER
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";

    ctx.fillText(
        `Time: ${Math.ceil(match.timer)}`,
        canvas.width / 2 - 60,
        50
    );

    // SCORE
    ctx.fillText(
        `P1 ${match.score.p1} - ${match.score.p2} P2`,
        canvas.width / 2 - 80,
        90
    );

    // ROUND
    ctx.fillText(
        `Round ${match.currentRound}`,
        canvas.width / 2 - 60,
        130
    );

    // WIN STATE
    if (match.matchOver) {

        const winner =
            match.score.p1 > match.score.p2
                ? "PLAYER 1 WINS"
                : "PLAYER 2 WINS";

        ctx.fillStyle = "yellow";

        ctx.fillText(
            winner,
            canvas.width / 2 - 120,
            200
        );
    }
}

// ============================================
// LOOP
// ============================================

function loop() {

    update();

    draw();

    requestAnimationFrame(loop);
}

loop();
