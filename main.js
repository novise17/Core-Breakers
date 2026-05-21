// ============================================
// FILE: main.js
// ============================================

import { Fighter } from "./fighters/Fighter.js";

// ============================================
// BLAZE ABILITIES
// ============================================

import { PlasmaDash } from "./abilities/fire/plasmaDash.js";

import { HeatwavePunch } from "./abilities/fire/heatwavePunch.js";

import { IgnitionField } from "./abilities/fire/ignitionfield.js";

import { FirestormBarrage } from "./abilities/fire/firestormBarrage.js";

import { SolarCollapse } from "./abilities/fire/solarCollapse.js";

// ============================================
// VFX IMPORTS
// ============================================

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
// PLAYERS
// ============================================

const player1 = new Fighter(
    "Blaze",
    200,
    "red",
    {
        left: "a",
        right: "d",
        jump: "w",
        attack: " "
    }
);

const player2 = new Fighter(
    "Volt",
    900,
    "blue",
    {
        left: "ArrowLeft",
        right: "ArrowRight",
        jump: "ArrowUp",
        attack: "Enter"
    }
);

// ============================================
// ABILITIES
// ============================================

player1.abilities = {

    q: new PlasmaDash(),

    w: new HeatwavePunch(),

    e: new IgnitionField(),

    r: new FirestormBarrage(),

    f: new SolarCollapse()
};

// ============================================
// ABILITY INPUTS
// ============================================

window.addEventListener("keydown", (e) => {

    // Q
    if (e.key === "q") {

        player1.abilities.q.use(
            player1,
            player2
        );
    }

    // W
    if (e.key === "w") {

        player1.abilities.w.use(
            player1,
            player2
        );
    }

    // E
    if (e.key === "e") {

        player1.abilities.e.use(
            player1,
            player2
        );
    }

    // R
    if (e.key === "r") {

        player1.abilities.r.use(
            player1,
            player2
        );
    }

    // F (ULTIMATE)
    if (e.key === "f") {

        player1.abilities.f.use(
            player1,
            player2
        );
    }
});

// ============================================
// UPDATE
// ============================================

function update() {

    player1.move(keys, canvas);

    player2.move(keys, canvas);

    // BASIC ATTACKS

    if (keys[player1.controls.attack]) {

        player1.attack(player2);
    }

    if (keys[player2.controls.attack]) {

        player2.attack(player1);
    }
}

// ============================================
// DRAW
// ============================================

function draw() {

    // SAVE CAMERA
    ctx.save();

    // SCREEN SHAKE
    applyShake(ctx);

    // CLEAR SCREEN
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // FLOOR
    ctx.fillStyle = "#222";

    ctx.fillRect(
        0,
        canvas.height - 20,
        canvas.width,
        20
    );

    // PLAYERS
    player1.draw(ctx);

    player2.draw(ctx);

    // PROJECTILES
    player1.updateProjectiles(
        ctx,
        player2
    );

    player2.updateProjectiles(
        ctx,
        player1
    );

    // PARTICLES
    updateParticles(ctx);

    // UI
    drawUI();

    // RESTORE CAMERA
    ctx.restore();
}

// ============================================
// UI
// ============================================

function drawUI() {

    // PLAYER 1 HEALTH
    ctx.fillStyle = "red";

    ctx.fillRect(
        20,
        20,
        player1.health * 3,
        20
    );

    // PLAYER 2 HEALTH
    ctx.fillStyle = "blue";

    ctx.fillRect(
        canvas.width - player2.health * 3 - 20,
        20,
        player2.health * 3,
        20
    );

    // COMBO COUNTER
    ctx.fillStyle = "white";

    ctx.font = "30px Arial";

    ctx.fillText(
        `Combo: ${player1.combo}`,
        20,
        100
    );

    // ENERGY TEXT
    ctx.fillText(
        `Energy: ${Math.floor(player1.energy)}`,
        20,
        140
    );
}

// ============================================
// GAME LOOP
// ============================================

function loop() {

    update();

    draw();

    requestAnimationFrame(loop);
}

loop();
