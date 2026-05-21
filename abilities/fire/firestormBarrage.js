// ============================================
// FILE: abilities/firestormBarrage.js
// ============================================

import { Ability } from "./Ability.js";

import { triggerShake } from "../vfx/screenShake.js";
import { spawnParticles } from "../vfx/particleSystem.js";

export const firestormBarrage = new Ability({

    name: "Firestorm Barrage",

    cooldown: 300,

    cost: 35,

    execute: (fighter, enemy) => {

        triggerShake(15);

        spawnParticles(
            enemy.x,
            enemy.y,
            "orange",
            40
        );

        enemy.takeHit(20, 25, fighter.facing);

        // 🔥 UNIQUE MECHANIC: Blaze heat system
        fighter.heat += 20;

        if (fighter.heat > 100) {

            enemy.takeHit(10, 10, fighter.facing);
        }

        fighter.combo += 2;
        fighter.energy += 10;
    }
});
