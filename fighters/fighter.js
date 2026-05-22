// ============================================ //
// FILE: fighters/fighter.js                   //
// ECHOES OF ASHERYA - BALANCED KERNEL V6      //
// ============================================ //

import { triggerShake } from "../vfx/screenShake.js";
import { spawnParticles } from "../vfx/particleSystem.js";
import { drawCoreAura } from "../vfx/coreAuras.js";
import { ComboTracker } from "../engine/comboTracker.js";

export class Fighter {
  constructor(name, x, color, controls, core) {
    this.name = name;
    this.core = core;

    // POSITION & PHYSICS BOUNDS
    this.x = x;
    this.y = 0;
    this.width = 60;
    this.height = 120;

    // MOVEMENT STATS
    this.speed = 6;
    this.baseSpeed = 6;
    this.jumpForce = -15;
    this.gravity = 0.7;
    this.velocityY = 0;
    this.isGrounded = false;

    // HEALTH & ENERGY RESOURCES
    this.maxHealth = 100;
    this.health = 100;
    this.maxEnergy = 100;
    this.energy = 100;

    // CENTRALIZED COMBAT EFFECTORS
    this.damageMultiplier = 1.0;
    this.cooldownMultiplier = 1.0; 
    this.defenseMultiplier = 1.0; 

    // COMBAT STATES
    this.hitstun = 0;
    this.invulnerable = false;
    this.isKO = false;
    this.facing = 1; 
    this.controls = controls;

    // BALANCED TRACKERS
    this.combo = new ComboTracker();

    // CENTRALIZED TRANSFORMATION STATE
    this.state = {
      transformed: false,
      meter: 0,
      maxMeter: 100,
      buffActive: false,
      justTransformed: false
    };

    // SLOTS & COOLDOWNS
    this.abilities = { z: null, x: null, c: null, v: null, u: null };
    this.cooldowns = { z: 0, x: 0, c: 0, v: 0, u: 0 };
    this.color = color;
    this.debug = false; 
  }

  update() {
    this.combo.update();

    if (this.state.transformed) {
      if (this.state.justTransformed) {
        this.state.justTransformed = false;
        return;
      }

      this.state.meter -= 0.25; 
      
      if (this.state.meter <= 0) {
        this.state.meter = 0;
        this.state.transformed = false;
        this.onRevert(); 
      }
    }
  }

  onTransform() { if (this.debug) console.log(`🔥 ${this.name} ASCENDED!`); }
  onRevert() { if (this.debug) console.log(`❄️ ${this.name} REVERTED.`); }

  gainTransform(amount) {
    if (this.state.transformed) return;
    const safeAmount = Number.isFinite(amount) && amount > 0 ? amount : 0;
    this.state.meter = Math.min(this.state.maxMeter, this.state.meter + safeAmount);

    if (this.state.meter >= this.state.maxMeter && !this.state.transformed) {
      this.state.transformed = true;
      this.state.justTransformed = true; 
      this.onTransform(); 
    }
  }

  move(keys, canvas) {
    if (this.isKO) return;
    if (this.hitstun > 0) { this.hitstun--; return; }

    if (keys[this.controls.left]) { this.x -= this.speed; this.facing = -1; }
    if (keys[this.controls.right]) { this.x += this.speed; this.facing = 1; }
    if (keys[this.controls.jump] && this.isGrounded) { this.velocityY = this.jumpForce; this.isGrounded = false; }

    this.y += this.velocityY;
    this.velocityY += this.gravity;

    if (this.y + this.height >= canvas.height) {
      this.y = canvas.height - this.height;
      this.velocityY = 0;
      this.isGrounded = true;
    }

    if (this.x < 0) this.x = 0;
    if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;

    this.energy = Math.min(this.maxEnergy, this.energy + 0.15);
    this.updateCooldowns();
  }

  updateCooldowns() {
    for (let key in this.cooldowns) {
      if (this.cooldowns[key] > 0) this.cooldowns[key]--;
    }
  }

  // ============================================ //
  // CENTRAL PIPELINE: COMBO DAMAGE PRORATION    //
  // ============================================ //
  dealDamage(target, baseDamage, knockback) {
    if (!target || target.isKO || target === this) return null;

    const validBaseDamage = Number.isFinite(baseDamage) ? baseDamage : 0;
    let outgoingDamage = Math.max(0, validBaseDamage * this.damageMultiplier);

    // TUNING PASS 1: Apply exponential damage decay scaling curves (Proration)
    // Long combo sequences decay iteratively by 8% per hit to block easy touch-of-death builds
    if (this.combo.count > 0) {
      const decayPerHit = 0.92;
      const proration = Math.pow(decayPerHit, this.combo.count);
      outgoingDamage *= proration;
    }

    const normalizedDirection = target.x >= this.x ? 1 : -1;
    const hitResult = target.takeHit(outgoingDamage, knockback, normalizedDirection);

    if (hitResult.success) {
      this.combo.registerHit();
      this.gainTransform(hitResult.damageProcessed * 0.20);
    }

    return hitResult;
  }

  useAbility(key, enemy) {
    const ability = this.abilities[key];
    if (!ability || this.cooldowns[key] > 0 || this.energy < ability.energyCost) return;

    this.energy -= ability.energyCost;
    ability.activate(this, enemy);
    this.cooldowns[key] = Math.floor(ability.cooldown * this.cooldownMultiplier);
  }

  // ============================================ //
  // RECEIVER BLOCK: PERCENT-DRIVEN KNOCKBACK     //
  // ============================================ //
  takeHit(incomingDamage, knockback, direction) {
    if (this.invulnerable) return { success: false, damageProcessed: 0, reason: "INVULNERABLE" };

    const finalDamage = Math.max(0, incomingDamage * this.defenseMultiplier);
    this.health -= finalDamage;
    this.hitstun = 12;

    this.gainTransform(finalDamage * 0.35);
    
    // Process infinite protection ceilings natively via hook tracking arrays
    this.combo.registerJuggle(this.isGrounded);

    const safeKnockback = Number.isFinite(knockback) ? Math.max(0, knockback) : 0;
    
    // TUNING PASS 3: Percent-driven risk escalation curves (Knockback scaling factor)
    // Characters take amplified knockback vectors proportional to their missing health pool
    const healthFactor = 1 + (1 - this.health / this.maxHealth);
    const scaledKnockback = safeKnockback * healthFactor;

    this.x += scaledKnockback * direction;

    triggerShake(scaledKnockback * 0.4);
    spawnParticles(this.x + this.width / 2, this.y + this.height / 2, this.color, 10);

    this.invulnerable = true;
    setTimeout(() => { this.invulnerable = false; }, 250);

    if (this.health <= 0) { this.health = 0; this.isKO = true; }

    return {
      success: true,
      damageProcessed: finalDamage,
      knockbackApplied: scaledKnockback,
      impactDirection: direction
    };
  }

  draw(ctx) {
    drawCoreAura(ctx, this);

    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    if (this.state.transformed) {
      ctx.strokeStyle = "white";
      ctx.lineWidth = 4;
      ctx.strokeRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
    }

    const meterRatio = Math.max(0, Math.min(1, this.state.meter / this.state.maxMeter));
    const healthRatio = Math.max(0, Math.min(1, this.health / this.maxHealth));
    const energyRatio = Math.max(0, Math.min(1, this.energy / this.maxEnergy));

    ctx.fillStyle = "gold";
    ctx.fillRect(this.x, this.y - 30, meterRatio * this.width, 6);

    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y - 20, healthRatio * this.width, 8);

    ctx.fillStyle = "cyan";
    ctx.fillRect(this.x, this.y - 10, energyRatio * this.width, 5);

    ctx.fillStyle = "white";
    ctx.font = "10px monospace";
    ctx.fillText(
      `MTR: ${Math.round(this.state.meter)} | ${this.state.transformed ? "OVERDRIVE" : "NORMAL"}`, 
      this.x, 
      this.y + this.height + 15
    );
    
    if (this.combo.count > 0) {
      ctx.fillStyle = "orange";
      ctx.font = "bold 11px Arial";
      ctx.fillText(
        `${this.combo.count} HIT ${this.combo.airHits > 0 ? `(JUGGLE: ${this.combo.airHits})` : ""}`, 
        this.x, 
        this.y - 42
      );
    }
  }

  drawHUDGrid(ctx, canvas, isPlayer1) {
    const slots = ["z", "x", "c", "v", "u"];
    const boxSize = 40;
    const padding = 8;
    const startX = isPlayer1 ? 20 : canvas.width - (slots.length * (boxSize + padding)) - 20;
    const posY = canvas.height - 55;

    slots.forEach((key, index) => {
      const x = startX + index * (boxSize + padding);
      const ability = this.abilities[key];
      
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.fillRect(x, posY, boxSize, boxSize);
      ctx.strokeStyle = this.state.transformed ? "gold" : "#555";
      ctx.lineWidth = this.state.transformed ? 2 : 1;
      ctx.strokeRect(x, posY, boxSize, boxSize);

      ctx.fillStyle = "#aaa";
      ctx.font = "9px sans-serif";
      const assignedKey = this.controls.abilities ? this.controls.abilities[key] : key.toUpperCase();
      ctx.fillText(assignedKey.toUpperCase(), x + 4, posY + 12);

      if (ability) {
        const maxCd = Math.floor(ability.cooldown * this.cooldownMultiplier);
        const currentCd = this.cooldowns[key];
        
        if (currentCd > 0 && maxCd > 0) {
          const cdRatio = Math.max(0, Math.min(1, currentCd / maxCd));
          ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
          ctx.fillRect(x, posY + (boxSize * (1 - cdRatio)), boxSize, boxSize * cdRatio);
          ctx.fillStyle = "#ff3333";
          ctx.font = "bold 10px monospace";
          ctx.fillText(Math.ceil(currentCd / 60) + "s", x + boxSize/2 - 6, posY + boxSize/2 + 4);
        }
        
        if (this.energy < ability.energyCost) {
          ctx.fillStyle = "rgba(0, 150, 255, 0.15)";
          ctx.fillRect(x, posY, boxSize, boxSize);
          ctx.strokeStyle = "#0066cc";
          ctx.strokeRect(x, posY, boxSize, boxSize);
        }
      }
    });
  }
}
