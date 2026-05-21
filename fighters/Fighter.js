// ============================================
// FILE: fighters/Fighter.js
// ============================================

import { triggerShake } from "../vfx/screenShake.js";
import { spawnParticles } from "../vfx/particleSystem.js";
import { AbilityRegistry } from "../abilities/abilityRegistry.js";

export class Fighter {

    constructor(name, x, color, controls, core = null) {

        // ============================
        // IDENTITY
        // ============================
        this.name = name;
        this.core = core; // fire / ice / lightning / earth / cosmic / shadow

        // ============================
        // POSITION
        // ============================
        this.x = x;
        this.y = 0;

        // ============================
        // SIZE
        // ============================
        this.width = 60;
        this.height = 120;

        // ============================
        // MOVEMENT
        // ============================
        this.velocityY = 0;
        this.speed = 6;
        this.jumpForce = -15;
        this.gravity = 0.7;
        this.isGrounded = false;

        // ============================
        // VISUAL
        // ============================
        this.color = color;

        // ============================
        // STATS
        // ============================
        this.health = 100;
        this.maxHealth = 100;

        this.energy = 100;
        this.maxEnergy = 100;

        this.armor = 0;

        // ============================
        // STATE
        // ============================
        this.hitstun = 0;
        this.invulnerable = false;

        // ============================
        // COMBAT
        // ============================
        this.combo = 0;
        this.facing = 1;

        // ============================
        // INPUT
        // ============================
        this.controls = controls;

        // ============================
        // PROJECTILES
        // ============================
        this.projectiles = [];

        // ============================
        // ABILITIES
        // ============================
        this.abilities = [];

        if (this.core) {

            this.loadAbilities();
        }

        // ============================
        // UNIQUE MECHANIC HOOKS
        // ============================
        this.heat = 0;
        this.nodes = 0;
        this.mass = 0;
    }

    // ============================================
    // ABILITY SYSTEM
    // ============================================

    loadAbilities() {

        if (!AbilityRegistry[this.core]) {

            console.warn(`No abilities found for core: ${this.core}`);
            return;
        }

        // clone abilities so cooldowns are independent per fighter
        this.abilities = AbilityRegistry[this.core].map(a => a);
    }

    updateAbilities() {

        for (let ability of this.abilities) {

            ability.update();
        }
    }

    useAbility(index, enemy) {

        if (!this.abilities[index]) return false;

        return this.abilities[index].use(this, enemy);
    }

    // ============================================
    // MOVEMENT
    // ============================================

    move(keys, canvas) {

        if (this.hitstun > 0) {

            this.hitstun--;

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
        if (keys[this.controls.up] && this.isGrounded) {

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

    regenEnergy() {

        if (this.energy < this.maxEnergy) {

            this.energy += 0.25;
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

            // optional hook for abilities (Blaze etc)
            if (this.onHit) this.onHit(enemy);
        }
    }

    // ============================================
    // DRAW
    // ============================================

    draw(ctx) {

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

        // INVULNERABLE FLASH
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
