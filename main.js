// ============================================
// FILE: main.js
// ECHOES OF ASHERYA - GAME ENTRY POINT
// ============================================
console.log("GAME IS RUNNING");
import { CharacterSelect } from "./ui/characterSelect.js";
import { Fighter } from "./fighters/Fighter.js";

// ===============================
// CANVAS SETUP
// ===============================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 600;

// ===============================
// INPUT SYSTEM
// ===============================

const keys = {};

window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

// ===============================
// GAME STATE
// ===============================

let gameState = "select"; // select | fight

// ===============================
// FIGHTERS (WILL BE CREATED)
// ===============================

let player1, player2;

// ===============================
// START FIGHT FUNCTION
// ===============================

function startFight(p1Data, p2Data) {

    player1 = new Fighter(
        p1Data.name,
        150,
        p1Data.color,
        { left: "a", right: "d", up: "w" },
        p1Data.core
    );

    player2 = new Fighter(
        p2Data.name,
        700,
        p2Data.color,
        { left: "ArrowLeft", right: "ArrowRight", up: "ArrowUp" },
        p2Data.core
    );

    gameState = "fight";
}

// ===============================
// CHARACTER SELECT SCREEN
// ===============================

const selectScreen = new CharacterSelect(
    [
        { name: "Blaze", color: "red", core: "fire" },
        { name: "Frost", color: "cyan", core: "ice" },
        { name: "Volt", color: "yellow", core: "lightning" },
        { name: "Titano", color: "gray", core: "earth" },
        { name: "Nova", color: "purple", core: "cosmic" },
        { name: "Shade", color: "black", core: "shadow" }
    ],
    startFight
);

// ===============================
// DRAW BACKGROUND
// ===============================

function drawStage() {

    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ground
    ctx.fillStyle = "#222";
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
}

// ===============================
// MAIN GAME LOOP
// ===============================

function gameLoop() {

    drawStage();

    // ===========================
    // CHARACTER SELECT STATE
    // ===========================

    if (gameState === "select") {

        selectScreen.update(keys);
        selectScreen.draw(ctx, canvas);
    }

    // ===========================
    // FIGHT STATE
    // ===========================

    if (gameState === "fight") {

        // UPDATE
        player1.move(keys, canvas);
        player2.move(keys, canvas);

        // DRAW
        player1.draw(ctx);
        player2.draw(ctx);

        // UI (basic health display)
        drawUI();
    }

    requestAnimationFrame(gameLoop);
}

// ===============================
// UI
// ===============================

function drawUI() {

    ctx.fillStyle = "white";
    ctx.font = "16px Arial";

    ctx.fillText(
        `${player1.name} HP: ${player1.health}`,
        20,
        30
    );

    ctx.fillText(
        `${player2.name} HP: ${player2.health}`,
        canvas.width - 200,
        30
    );
}

// ===============================
// START GAME
// ===============================

gameLoop();
