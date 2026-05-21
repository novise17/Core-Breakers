import { CoreVisuals } from "./coreVisuals.js";

export function drawCoreAura(ctx, fighter) {

    const visual = CoreVisuals[fighter.core];

    if (!visual) return;

    const x = fighter.x + fighter.width / 2;
    const y = fighter.y + fighter.height / 2;

    ctx.save();
    ctx.globalAlpha = 0.25;

    ctx.fillStyle = visual.aura;

    ctx.beginPath();
    ctx.arc(x, y, 85 + Math.random() * 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}
