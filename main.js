import { Fighter } from "./fighters/Fighter.js";

import { PlasmaDash } from "./abilities/fire/plasmaDash.js";
import { HeatwavePunch } from "./abilities/fire/heatwavePunch.js";
import { IgnitionField } from "./abilities/fire/ignitionfield.js";
import { FirestormBarrage } from "./abilities/fire/firestormBarrage.js";
import { SolarCollapse } from "./abilities/fire/solarCollapse.js";

// =============================
// CANVAS
// =============================

const canvas = document.getElementById("gameCanvas");

const ctx = canvas.getContext("2d");

canvas.width = 1200;
canvas.height = 600;

// =============================
// INPUT
// =============================

const keys = {};

window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

// =============================
// PLAYERS
// =============================

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

// =============================
// ABILITIES
// =============================

player1.abilities = {

    q: new PlasmaDash(),

    w: new HeatwavePunch(),

    e: new IgnitionField(),

    r: new FirestormBarrage(),

    f: new SolarCollapse()
};

// =============================
// ABILITY INPUTS
// =============================

window.addEventListener("keydown", (e) => {

    if (e.key === "q") {
        player1.abilities.q.use(player1, player2);
    }

    if (e.key === "w") {
        player1.abilities.w.use(player1, player2);
    }

    if (e.key === "e") {
        player1.abilities.e.use(player1, player2);
    }

    if (e.key === "r") {
        player1.abilities.r.use(player1, player2);
    }

    if (e.key === "f") {
        player1.abilities.f.use(player1, player2);
    }
});

// =============================
// UPDATE
// =============================

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

// =============================
// DRAW
// =============================

function draw() {

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
    player1.updateProjectiles(ctx, player2);

    player2.updateProjectiles(ctx, player1);

    // UI
    drawUI();
}

// =============================
// UI
// =============================

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
}

// =============================
// GAME LOOP
// =============================

function loop() {

    update();

    draw();

    requestAnimationFrame(loop);
}

loop();
