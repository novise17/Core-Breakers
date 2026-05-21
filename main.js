// ============================================
// FILE: main.js
// ============================================

import { MatchManager } from "./engine/matchManager.js";

import { CharacterSelect } from "./ui/characterSelect.js";

import { Blaze } from "./fighters/Blaze.js";
import { Volt } from "./fighters/Volt.js";
import { Frost } from "./fighters/Frost.js";
import { Nova } from "./fighters/Nova.js";
import { Shade } from "./fighters/Shade.js";
import { Titano } from "./fighters/Titano.js";

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
// ROSTER (REAL FIGHTERS)
// ============================================

const roster = [

    new Blaze(0, { left: "a", right: "d", jump: "w", attack: " " }),

    new Volt(0, { left: "a", right: "d", jump: "w", attack: " " }),

    new Frost(0, { left: "a", right: "d", jump: "w", attack: " " }),

    new Nova(0, { left: "a", right: "d", jump: "w", attack: " " }),

    new Shade(0, { left: "a", right: "d", jump: "w", attack: " " }),

    new Titano(0, { left: "a", right: "d", jump: "w", attack: " " })
];

// ============================================
// CHARACTER SELECT
// ============================================

const selectScreen = new CharacterSelect(roster);

// ============================================
// MATCH
// ============================================

let match = null;

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
    }

    if (state === "fight") {

        // attacks handled in update loop (cleaner)
    }
});

// ============================================
// UPDATE KEYS
// ============================================

const keys = {};

window.addEventListener("keydown", (e) => keys[e.key] = true);

window.addEventListener("keyup", (e) => keys[e.key] = false);

// ============================================
// UPDATE
// ============================================

function update() {

    if (state !== "fight") return;

    match.update();

    if (!match.roundOver && !match.matchOver) {

        match.player1.move(keys, canvas);

        match.player2.move(keys, canvas);

        if (keys[match.player1.controls.attack]) {

            match.player1.attack(match.player2);
        }

        if (keys[match.player2.controls.attack]) {

            match.player2.attack(match.player1);
        }
    }
}

// ============================================
// DRAW SELECT
// ============================================

function drawSelect() {

    ctx.fillStyle = "white";

    ctx.font = "40px Arial";

    ctx.fillText("SELECT FIGHTERS", 420, 80);

    roster.forEach((f, i) => {

        const x = 150 + i * 160;

        const y = 250;

        ctx.fillStyle =
            i === selectScreen.selectedIndex
                ? "yellow"
                : "gray";

        ctx.fillRect(x, y, 80, 120);

        ctx.fillStyle = "white";

        ctx.fillText(f.name || "F", x + 10, y + 70);
    });

    ctx.fillText(
        `Phase: ${selectScreen.phase}`,
        50,
        500
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

    ctx.fillText(`Time: ${Math.ceil(match.timer)}`, 520, 50);

    ctx.fillText(
        `Score ${match.score.p1} - ${match.score.p2}`,
        480,
        90
    );
}

// ============================================
// LOOP
// ============================================

function loop() {

    if (state === "select") drawSelect();

    else drawFight();

    requestAnimationFrame(loop);
}

loop();
