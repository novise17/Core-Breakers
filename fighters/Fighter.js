// ============================================
// FILE: fighters/fighter.js
// ============================================

import { triggerShake } from "../vfx/screenShake.js";
import { spawnParticles } from "../vfx/particleSystem.js";
import { drawCoreAura } from "../vfx/coreAuras.js";

export class Fighter {

    constructor(name, x, color, controls, core) {

        this.name = name;
        this.core = core;

        // POSITION
        this.x = x;
        this.y = 0;

        // SIZE
        this.width = 60;
        this.height = 120;

        // MOVEMENT
        this.speed = 6;
        this.baseSpeed = 6;

        this.jumpForce = -15;
        this.gravity = 0.7;

        this.velocityY = 0;
        this.isGrounded = false;

        // HEALTH
        this.maxHealth = 100;
        this.health = 100;

        // ENERGY
        this.maxEnergy = 100;
        this.energy = 100;

        // COMBAT
        this.hitstun = 0;
        this.invulnerable = false;
        this.isKO = false;

        this.combo = 0;

        // DIRECTION
        this.facing = 1;

        // INPUT
        this.controls = controls;

        // ============================================
        // HERO STATE SYSTEM
        // ============================================

        this.state = {

            transformed: false,

            meter: 0,

            maxMeter: 100,

            buffActive: false
        };

        // ============================================
        // ABILITIES
        // ============================================

        this.abilities = {

            z: null,
            x: null,
            c: null,
            v: null,
            u: null
        };

        // cooldowns
        this.cooldowns = {

            z: 0,
            x: 0,
            c: 0,
            v: 0,
            u: 0
        };

        // VISUALS
        this.color = color;
    }

    // ============================================
    // MOVEMENT
    // ============================================

    move(keys, canvas) {

        if (this.isKO) return;

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
        if (keys[this.controls.jump] && this.isGrounded) {

            this.velocityY = this.jumpForce;
            this.isGrounded = false;
        }

        // GRAVITY
        this.y += this.velocityY;
        this.velocityY += this.gravity;

        // FLOOR
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
        this.energy = Math.min(
            this.maxEnergy,
            this.energy + 0.15
        );

        // UPDATE COOLDOWNS
        this.updateCooldowns();
    }

    // ============================================
    // COOLDOWNS
    // ============================================

    updateCooldowns() {

        for (let key in this.cooldowns) {

            if (this.cooldowns[key] > 0) {

                this.cooldowns[key]--;
            }
        }
    }

    // ============================================
    // ABILITY USE
    // ============================================

    useAbility(key, enemy) {

        const ability = this.abilities[key];

        if (!ability) return;

        // cooldown check
        if (this.cooldowns[key] > 0) return;

        // energy check
        if (this.energy < ability.energyCost) return;

        // spend energy
        this.energy -= ability.energyCost;

        // activate
        ability.activate(this, enemy);

        // apply cooldown
        this.cooldowns[key] = ability.cooldown;
    }

    // ============================================
    // DAMAGE
    // ============================================

    takeHit(damage, knockback, direction) {

        if (this.invulnerable) return;

        this.health -= damage;

        this.hitstun = 12;

        // knockback
        this.x += knockback * direction;

        // VFX
        triggerShake(knockback * 0.4);

        spawnParticles(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.color,
            10
        );

        // invulnerability
        this.invulnerable = true;

        setTimeout(() => {

            this.invulnerable = false;

        }, 250);

        // KO
        if (this.health <= 0) {

            this.health = 0;

            this.isKO = true;
        }
    }

    // ============================================
    // DRAW
    // ============================================

    draw(ctx) {

        drawCoreAura(ctx, this);

        // body
        ctx.fillStyle = this.color;

        ctx.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );

        // transformed glow
        if (this.state.transformed) {

            ctx.strokeStyle = "white";

            ctx.lineWidth = 4;

            ctx.strokeRect(
                this.x - 2,
                this.y - 2,
                this.width + 4,
                this.height + 4
            );
        }

        // health bar
        ctx.fillStyle = "red";

        ctx.fillRect(
            this.x,
            this.y - 20,
            this.health,
            8
        );

        // energy bar
        ctx.fillStyle = "cyan";

        ctx.fillRect(
            this.x,
            this.y - 10,
            this.energy,
            5
        );

        // meter bar
        ctx.fillStyle = "gold";

        ctx.fillRect(
            this.x,
            this.y - 30,
            this.state.meter,
            6
        );
    }
}
