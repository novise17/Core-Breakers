import { Ability } from "../Ability.js";

export class ArcKnives extends Ability {
    constructor() {
        super({ name: "Arc Knives", cooldown: 1000, energyCost: 12 });
    }

    activate(fighter, enemy) {
        enemy.health -= 12;
        enemy.x += fighter.facing * 20;
    }
}
