// ============================================
// FILE: vfx/coreAuras.js
// ============================================

export function drawCoreAura(ctx, fighter) {

    const x = fighter.x + fighter.width / 2;
    const y = fighter.y + fighter.height / 2;

    ctx.save();

    ctx.globalAlpha = 0.25;

    // ============================
    // FIRE CORE
    // ============================
    if (fighter.core === "fire") {

        ctx.fillStyle = "orange";

        ctx.beginPath();
        ctx.arc(x, y, 80 + Math.random() * 10, 0, Math.PI * 2);
        ctx.fill();
    }

    // ============================
    // ICE CORE
    // ============================
    if (fighter.core === "ice") {

        ctx.fillStyle = "cyan";

        ctx.beginPath();
        ctx.arc(x, y, 70 + Math.random() * 5, 0, Math.PI * 2);
        ctx.fill();
    }

    // ============================
    // LIGHTNING CORE
    // ============================
    if (fighter.core === "lightning") {

        ctx.fillStyle = "yellow";

        ctx.beginPath();
        ctx.arc(x, y, 85 + Math.random() * 15, 0, Math.PI * 2);
        ctx.fill();
    }

    // ============================
    // EARTH CORE
    // ============================
    if (fighter.core === "earth") {

        ctx.fillStyle = "#8B5A2B";

        ctx.beginPath();
        ctx.arc(x, y, 75, 0, Math.PI * 2);
        ctx.fill();
    }

    // ============================
    // COSMIC CORE
    // ============================
    if (fighter.core === "cosmic") {

        ctx.fillStyle = "purple";

        ctx.beginPath();
        ctx.arc(x, y, 95 + Math.random() * 20, 0, Math.PI * 2);
        ctx.fill();

        // extra distortion layer
        ctx.fillStyle = "white";
        ctx.globalAlpha = 0.1;

        ctx.beginPath();
        ctx.arc(x, y, 120, 0, Math.PI * 2);
        ctx.fill();
    }

    // ============================
    // SHADOW CORE
    // ============================
    if (fighter.core === "shadow") {

        ctx.fillStyle = "black";

        ctx.beginPath();
        ctx.arc(x, y, 90, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 0.1;

        ctx.fillStyle = "purple";

        ctx.beginPath();
        ctx.arc(x, y, 110, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}
