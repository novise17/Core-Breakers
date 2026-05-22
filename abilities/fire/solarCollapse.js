import { triggerShake } from "../../vfx/screenShake.js";

export const solarCollapse = {

    name: "Solar Collapse",

    energyCost: 100,

    cooldown: 20,

    activate(fighter, enemy) {

        fighter.gainHeat(40);

        triggerShake(25);

        enemy.takeHit(
            fighter.boostDamage(40),
            40,
            fighter.facing
        );
    }
};
