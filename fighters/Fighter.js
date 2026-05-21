// ============================================
// FILE: fighters/Fighter.js
// ============================================

import { triggerShake } from "../vfx/screenShake.js";
import { spawnParticles } from "../vfx/particleSystem.js";

export class Fighter {

    constructor(name, x, color, controls) {

        this.name = name;

        // POSITION
        this.x = x;
        this.y = 0;

        // SIZE
        this.width = 60;
        this.height = 120;

        // MOVEMENT
        this.velocityY = 0;
        this.speed = 6;
        this.jumpForce = -15;
        this.gravity = 0.7;

        // VISUAL
        this.color = color;

        // STATS
        this.health = 100;

        this.energy = 100;
        this.maxEnergy = 100;

        this.armor = 0;

        // STATE
        this.isGrounded = false;

        this.isAttacking = false;

        this.attackCooldown = false;

        this.invulnerable = false;

        // COMBAT
        this.combo = 0;

        this.hitstun = 0;

        this.knockbackX = 0;

        this.knockbackDecay = 0.8;

        // INPUT
        this.controls = controls;

        // DIRECTION
        this.facing = 1;

        // PROJECTILES
        this.projectiles = [];

        // ABILITIES
        this.abilities = {};
    }

    // ============================================
    // MOVEMENT
    // ============================================

    move(keys, canvas) {

        // HITSTUN
        if (this.hitstun > 0) {

            this.hitstun--;

            this.x += this.knockbackX;

            this.knockbackX *= this.knockbackDecay;

            return;
        }

        // LEFT
        if (keys[this.controls.left]) {

            this.x -= this.speed;

            this.facing = -1;
        }

        // RIGHT
        if (keys[this.controls.right]) {

            this.x += this.speed;

            this.facing = 1;
        }

        // JUMP
        if (keys[this.controls.jump] && this.isGrounded) {

            this.velocityY = this.jumpForce;

            this.isGrounded = false;
        }

        // GRAVITY
        this.y += this.velocityY;

        this.velocityY += this.gravity;

        // FLOOR COLLISION
        if (this.y + this.height >= canvas.height) {

            this.y = canvas.height - this.height;

            this.velocityY = 0;

            this.isGrounded = true;
        }

        // SCREEN BOUNDS
        if (this.x < 0) this.x = 0;

        if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width;
        }

        // ENERGY REGEN
        this.regenEnergy();
    }

    // ============================================
    // ENERGY
    // ============================================

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

        // ARMOR REDUCTION
        const finalDamage = Math.max(
            damage - this.armor * 0.1,
            1
        );

        this.health -= finalDamage;

        // HITSTUN
        this.hitstun = 20;

        // KNOCKBACK
        this.knockbackX = knockback * direction;

        // SCREEN SHAKE
        triggerShake(knockback * 0.5);

        // PARTICLES
        spawnParticles(
            this.x + this.width / 2,
            this.y + this.height / 2,
            "orange",
            12
        );

        // INVULNERABILITY FRAMES
        this.invulnerable = true;

        setTimeout(() => {

            this.invulnerable = false;

        }, 300);
    }

    // ============================================
    // BASIC ATTACK
    // ============================================

    attack(enemy) {

        if (this.attackCooldown) return;

        this.attackCooldown = true;

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

            enemy.takeHit(
                10,
                12,
                this.facing
            );

            this.combo++;
        }

        setTimeout(() => {

            this.attackCooldown = false;

        }, 250);
    }

    // ============================================
    // PROJECTILES
    // ============================================

    updateProjectiles(ctx, enemy) {

        for (let i = 0; i < this.projectiles.length; i++) {

            let p = this.projectiles[i];

            p.x += p.speed;

            ctx.fillStyle = p.color || "orange";

            ctx.fillRect(
                p.x,
                p.y,
                p.width,
                p.height
            );

            // COLLISION
            if (

                p.x < enemy.x + enemy.width &&

                p.x + p.width > enemy.x &&

                p.y < enemy.y + enemy.height &&

                p.y + p.height > enemy.y

            ) {

                enemy.takeHit(
                    p.damage,
                    p.knockback || 10,
                    this.facing
                );

                this.projectiles.splice(i, 1);

                i--;
            }
        }
    }

    // ============================================
    // DRAW
    // ============================================

    draw(ctx) {

        // CHARACTER
        ctx.fillStyle = this.color;

        ctx.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );

        // ENERGY BAR
        ctx.fillStyle = "cyan";

        ctx.fillRect(
            this.x,
            this.y - 10,
            this.energy,
            5
        );

        // INVULNERABILITY FLASH
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
