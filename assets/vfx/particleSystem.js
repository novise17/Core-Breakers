export const particles = [];

export function spawnParticles(x, y, color, amount = 10) {

    for (let i = 0; i < amount; i++) {

        particles.push({
            x,
            y,

            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,

            size: Math.random() * 6 + 2,

            life: 40,

            color
        });
    }
}

export function updateParticles(ctx) {

    for (let i = 0; i < particles.length; i++) {

        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        p.life--;

        ctx.fillStyle = p.color;

        ctx.fillRect(
            p.x,
            p.y,
            p.size,
            p.size
        );

        if (p.life <= 0) {

            particles.splice(i, 1);

            i--;
        }
    }
}
