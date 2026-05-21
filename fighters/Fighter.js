// ============================================
// FILE: fighters/Fighter.js
// ============================================

import { triggerShake } from "../vfx/screenShake.js";
import { spawnParticles } from "../vfx/particleSystem.js";

export class Fighter {

    constructor(name, x, color, controls) {

        this.name = name;

        this.x = x;
        this.y = 0;

        this.width = 60;
        this.height = 120;

        // MOVEMENT
        this.velocityY = 0;
        this.speed = 6;
        this.jumpForce = -15;
        this.gravity = 0.7;

        this.color = color;

        // STATS
        this.health = 100;
        this.energy = 100;
        this.maxEnergy = 100;
        this.armor = 0;

        // STATE
        this.isGrounded = false;
        this.hitstun = 0;
        this.invulnerable = false;

        // COMBAT
        this.combo = 0;
        this.knockbackX = 0;
        this.knockbackDecay = 0.8;

        // INPUT
        this.controls = controls;
        this.facing = 1;

        // PROJECTILES
        this.projectiles = [];

        // ⚙️ ABILITY SYSTEM
        this.abilities = [];

        // 🧬 UNIQUE MECHANIC HOOKS
        this.heat = 0;
        this.nodes = 0;
        this.mass = 0;
    }

    // ============================================
    // ABILITIES
    // ============================================

    updateAbilities() {

        for (let ability of this.abilities) {

            ability.update();
        }
    }

    useAbility(index, enemy) {

        if (this.abilities[index]) {

            this.abilities[index].use(this, enemy);
        }
    }

    // ============================================
    // MOVEMENT
    // ============================================

    move(keys, canvas) {

        this.updateAbilities();

        if (this.hitstun > 0) {

            this.hitstun--;

            this.x += this.knockbackX;

            this.knockbackX *= this.knockbackDecay;

            return;
        }

        if (keys[this.controls.left]) {

            this.x -= this.speed;
            this.facing = -1;
        }

        if (keys[this.controls.right]) {

            this.x += this.speed;
            this.facing = 1;
        }

        if (keys[this.controls.jump] && this.isGrounded) {

            this.velocityY = this.jumpForce;
            this.isGrounded = false;
        }

        this.y += this.velocityY;
        this.velocityY += this.gravity;

        if (this.y + this.height >= canvas.height) {

            this.y = canvas.height - this.height;

            this.velocityY = 0;

            this.isGrounded = true;
        }

        if (this.x < 0) this.x = 0;

        if (this.x + this.width > canvas.width) {

            this.x = canvas.width - this.width;
        }

        this.regenEnergy();
    }

    regenEnergy() {

        if (this.energy < this.maxEnergy) {

            this.energy += 0.2;
        }
    }

    // ============================================
    // DAMAGE SYSTEM
    // ============================================

    takeHit(damage, knockback, direction) {

        if (this.invulnerable) return;

        const finalDamage = Math.max(
            damage - this.armor * 0.1,
            1
        );

        this.health -= finalDamage;

        this.hitstun = 20;

        this.knockbackX = knockback * direction;

        triggerShake(knockback * 0.5);

        spawnParticles(
            this.x + this.width / 2,
            this.y + this.height / 2,
            "orange",
            12
        );

        this.invulnerable = true;

        setTimeout(() => {

            this.invulnerable = false;

        }, 300);
    }

    // ============================================
    // BASIC ATTACK
    // ============================================

    attack(enemy) {

        const hitbox = {

            x: this.facing === 1
                ? this.x + this.width
                : this.x - 40,

            y: this.y + 30,

            width: 40,
            height: 30
        };

        if (
            hitbox.x < enemy.x + enemy.width &&
            hitbox.x + hitbox.width > enemy.x &&
            hitbox.y < enemy.y + enemy.height &&
            hitbox.y + hitbox.height > enemy.y
        ) {

            enemy.takeHit(10, 12, this.facing);

            this.combo++;

            // 🔥 HOOK EXAMPLE (used by Blaze later)
            this.onHit?.(enemy);
        }
    }

    // ============================================
    // DRAW
    // ============================================

    draw(ctx) {

        ctx.fillStyle = this.color;

        ctx.fillRect(this.x, this.y, this.width, this.height);

        // ENERGY BAR
        ctx.fillStyle = "cyan";

        ctx.fillRect(
            this.x,
            this.y - 10,
            this.energy,
            5
        );

        if (this.invulnerable) {

            ctx.strokeStyle = "white";

            ctx.strokeRect(
                this.x,
                this.y,
                this.width,
                this.height
            );
        }
    }
}
