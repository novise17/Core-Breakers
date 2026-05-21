import { Ability } from "../Ability.js";

export class NightfallSlash extends Ability {
    constructor() {
        super({ name: "Nightfall Slash", cooldown: 1800, energyCost: 20 });
    }

    activate(fighter, enemy) {
        enemy.health -= 16;
        enemy.x += fighter.facing * 50;
    }
}
