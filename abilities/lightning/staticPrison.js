import { Ability } from "../Ability.js";

export class StaticPrison extends Ability {
    constructor() {
        super({ name: "Static Prison", cooldown: 2500, energyCost: 25 });
    }

    activate(fighter, enemy) {
        enemy.speed = 1;

        setTimeout(() => {
            enemy.speed = 6;
        }, 2500);
    }
}
