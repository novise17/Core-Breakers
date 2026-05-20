import { Ability } from "../Ability.js";

export class Railstep extends Ability {
    constructor() {
        super({ name: "Railstep", cooldown: 600, energyCost: 10 });
    }

    activate(fighter) {
        fighter.x += fighter.facing * 90;
    }
}
