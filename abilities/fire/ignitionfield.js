import { Ability } from "../Ability.js";

export class IgnitionField extends Ability {
    constructor() {
        super({
            name: "Ignition Field",
            cooldown: 2000,
            energyCost: 25
        });
    }

    activate(fighter, enemy) {
        enemy.health -= 5;

        const burn = setInterval(() => {
            enemy.health -= 2;
        }, 500);

        setTimeout(() => {
            clearInterval(burn);
        }, 3000);
    }
}
