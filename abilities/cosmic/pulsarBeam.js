import { Ability } from "../Ability.js";

export class PulsarBeam extends Ability {
    constructor() {
        super({ name: "Pulsar Beam", cooldown: 900, energyCost: 12 });
    }

    activate(fighter, enemy) {
        enemy.health -= 14;
    }
}
