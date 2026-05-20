import { Ability } from "../Ability.js";

export class OrbitShift extends Ability {
    constructor() {
        super({ name: "Orbit Shift", cooldown: 2500, energyCost: 22 });
    }

    activate(fighter) {
        fighter.x += fighter.facing * 100; // teleport dash
    }
}
