import { Ability } from "../Ability.js";

export class FaultLine extends Ability {
    constructor() {
        super({ name: "Fault Line", cooldown: 2200, energyCost: 22 });
    }

    activate(fighter, enemy) {
        enemy.health -= 10;
        enemy.x += fighter.facing * 80;
    }
}
