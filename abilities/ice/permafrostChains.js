import { Ability } from "../Ability.js";

export class PermafrostChains extends Ability {
    constructor() {
        super({ name: "Permafrost Chains", cooldown: 2200, energyCost: 22 });
    }

    activate(fighter, enemy) {
        enemy.speed = 1;
        enemy.health -= 8;
    }
}
