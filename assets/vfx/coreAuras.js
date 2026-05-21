// ============================================
// FILE: vfx/coreAuras.js
// ============================================

export function drawCoreAura(ctx, fighter) {

    const x = fighter.x + fighter.width / 2;
    const y = fighter.y + fighter.height / 2;

    ctx.save();
    ctx.globalAlpha = 0.25;

    // FIRE
    if (fighter.core === "fire") {

        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(x, y, 80 + Math.random() * 10, 0, Math.PI * 2);
        ctx.fill();
    }

    // ICE
    if (fighter.core === "ice") {

        ctx.fillStyle = "cyan";
        ctx.beginPath();
        ctx.arc(x, y, 75, 0, Math.PI * 2);
        ctx.fill();
    }

    // LIGHTNING
    if (fighter.core === "lightning") {

        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(x, y, 85 + Math.random() * 10, 0, Math.PI * 2);
        ctx.fill();
    }

    // EARTH
    if (fighter.core === "earth") {

        ctx.fillStyle = "#8B5A2B";
        ctx.beginPath();
        ctx.arc(x, y, 70, 0, Math.PI * 2);
        ctx.fill();
    }

    // COSMIC
    if (fighter.core === "cosmic") {

        ctx.fillStyle = "purple";
        ctx.beginPath();
        ctx.arc(x, y, 95, 0, Math.PI * 2);
        ctx.fill();
    }

    // SHADOW
    if (fighter.core === "shadow") {

        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(x, y, 90, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}
