// ============================================
// FILE: main.js
// ============================================

import { Fighter } from "./fighters/Fighter.js";

import { Blaze } from "./fighters/Blaze.js";
// later add: Volt, Frost, Nova, Shade, Titano

import { MatchManager } from "./engine/matchManager.js";

import { CharacterSelect } from "./ui/characterSelect.js";

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
// GAME STATE
// ============================================

let state = "select"; // select | fight

// ============================================
// ROSTER
// ============================================

const roster = [

    new Blaze(200, {
        left: "a",
        right: "d",
        jump: "w",
        attack: " "
    }),

    new Blaze(200, {
        left: "a",
        right: "d",
        jump: "w",
        attack: " "
    }),

    new Blaze(200, {
        left: "a",
        right: "d",
        jump: "w",
        attack: " "
    })

    // later replace with Volt, Frost, Nova, Shade, Titano
];

// ============================================
// CHARACTER SELECT
// ============================================

const selectScreen = new CharacterSelect(roster);

// ============================================
// MATCH (created later)
// ============================================

let match;

// ============================================
// INPUT
// ============================================

window.addEventListener("keydown", (e) => {

    if (state === "select") {

        selectScreen.handleInput(e.key);

        if (selectScreen.isReady()) {

            const fighters = selectScreen.getFighters();

            match = new MatchManager(
                fighters.p1,
                fighters.p2
            );

            state = "fight";
        }

        return;
    }

    // FIGHT INPUTS WILL GO HERE
});

// ============================================
// UPDATE
// ============================================

function update() {

    if (state === "fight") {

        match.update();

        if (!match.roundOver && !match.matchOver) {

            match.player1.move(keys, canvas);

            match.player2.move(keys, canvas);
        }
    }
}

// ============================================
// DRAW CHARACTER SELECT
// ============================================

function drawSelect() {

    ctx.fillStyle = "white";

    ctx.font = "40px Arial";

    ctx.fillText(
        "SELECT YOUR FIGHTERS",
        350,
        80
    );

    roster.forEach((f, i) => {

        const x = 200 + i * 200;

        const y = 250;

        ctx.fillStyle =
            i === selectScreen.selectedP1
                ? "red"
                : i === selectScreen.selectedP2
                ? "blue"
                : "gray";

        ctx.fillRect(x, y, 80, 120);

        ctx.fillStyle = "white";

        ctx.fillText(
            "F",
            x + 30,
            y + 70
        );
    });

    ctx.fillText(
        `P1 Ready: ${selectScreen.confirmedP1}`,
        50,
        500
    );

    ctx.fillText(
        `P2 Ready: ${selectScreen.confirmedP2}`,
        50,
        550
    );
}

// ============================================
// DRAW FIGHT
// ============================================

function drawFight() {

    ctx.save();

    applyShake(ctx);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#222";

    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

    match.player1.draw(ctx);

    match.player2.draw(ctx);

    match.player1.updateProjectiles(ctx, match.player2);

    match.player2.updateProjectiles(ctx, match.player1);

    updateParticles(ctx);

    drawUI();

    ctx.restore();
}

// ============================================
// UI
// ============================================

function drawUI() {

    ctx.fillStyle = "red";

    ctx.fillRect(20, 20, match.player1.health * 3, 20);

    ctx.fillStyle = "blue";

    ctx.fillRect(canvas.width - match.player2.health * 3 - 20, 20, match.player2.health * 3, 20);

    ctx.fillStyle = "white";

    ctx.font = "30px Arial";

    ctx.fillText(
        `Time: ${Math.ceil(match.timer)}`,
        canvas.width / 2 - 60,
        50
    );

    ctx.fillText(
        `P1 ${match.score.p1} - ${match.score.p2} P2`,
        canvas.width / 2 - 80,
        90
    );
}

// ============================================
// LOOP
// ============================================

function loop() {

    if (state === "select") {

        drawSelect();

    } else {

        drawFight();
    }

    requestAnimationFrame(loop);
}

loop();
