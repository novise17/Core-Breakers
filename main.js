// ============================================
// FILE: main.js
// ============================================

import { MatchManager } from "./engine/matchManager.js";

import { CharacterSelect } from "./ui/characterSelect.js";

import { IntroScreen } from "./ui/introScreen.js";

import { HUD } from "./ui/hud.js";

// Fighters
import { Blaze } from "./fighters/Blaze.js";
import { Volt } from "./fighters/Volt.js";
import { Frost } from "./fighters/Frost.js";
import { Nova } from "./fighters/Nova.js";
import { Shade } from "./fighters/Shade.js";
import { Titano } from "./fighters/Titano.js";

// VFX
import { applyShake } from "./vfx/screenShake.js";
import { updateParticles } from "./vfx/particleSystem.js";

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

let state = "select"; 
// select → intro → fight

// ============================================
// ROSTER
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
// SYSTEMS
// ============================================

const selectScreen = new CharacterSelect(roster);

const introScreen = new IntroScreen();

let match = null;

let hud = null;

// ============================================
// INPUT
// ============================================

const keys = {};

window.addEventListener("keydown", (e) => {

    // CHARACTER SELECT INPUT
    if (state === "select") {

        selectScreen.handleInput(e.key);

        if (selectScreen.isReady()) {

            const fighters = selectScreen.getFighters();

            match = new MatchManager(
                fighters.p1,
                fighters.p2
            );

            hud = new HUD(
                match.player1,
                match.player2,
                match
            );

            introScreen.start();

            state = "intro";
        }
    }

    // FIGHT INPUT
    keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {

    keys[e.key] = false;
});

// ============================================
// UPDATE
// ============================================

function update() {

    if (state === "intro") {

        introScreen.update();

        if (introScreen.done) {

            state = "fight";
        }

        return;
    }

    if (state === "fight") {

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
}

// ============================================
// DRAW SELECT
// ============================================

function drawSelect() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";

    ctx.font = "40px Arial";

    ctx.textAlign = "center";

    ctx.fillText("SELECT FIGHTERS", canvas.width / 2, 80);

    roster.forEach((f, i) => {

        const x = 150 + i * 160;

        const y = 250;

        ctx.fillStyle =
            i === selectScreen.selectedIndex
                ? "yellow"
                : "gray";

        ctx.fillRect(x, y, 80, 120);

        ctx.fillStyle = "white";

        ctx.fillText(
            f.name,
            x + 40,
            y + 70
        );
    });

    ctx.fillText(
        `Phase: ${selectScreen.phase}`,
        canvas.width / 2,
        500
    );
}

// ============================================
// DRAW INTRO
// ============================================

function drawIntro() {

    introScreen.draw(ctx);
}

// ============================================
// DRAW FIGHT
// ============================================

function drawFight() {

    ctx.save();

    applyShake(ctx);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // FLOOR
    ctx.fillStyle = "#222";

    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

    // FIGHTERS
    match.player1.draw(ctx);
    match.player2.draw(ctx);

    // PROJECTILES
    match.player1.updateProjectiles(ctx, match.player2);
    match.player2.updateProjectiles(ctx, match.player1);

    // PARTICLES
    updateParticles(ctx);

    // HUD (NEW)
    hud.draw(ctx, canvas);

    ctx.restore();
}

// ============================================
// LOOP
// ============================================

function loop() {

    update();

    if (state === "select") drawSelect();
    else if (state === "intro") drawIntro();
    else drawFight();

    requestAnimationFrame(loop);
}

loop();
