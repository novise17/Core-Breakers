// ============================================
// FILE: abilities/Ability.js
// ============================================

export class Ability {

    constructor({
        name,
        cooldown,
        cost,
        execute
    }) {

        this.name = name;

        this.cooldownMax = cooldown;

        this.cooldown = 0;

        this.cost = cost;

        this.execute = execute; // function(fighter, enemy)
    }

    canUse(fighter) {

        return (
            this.cooldown <= 0 &&
            fighter.energy >= this.cost
        );
    }

    use(fighter, enemy) {

        if (!this.canUse(fighter)) return false;

        fighter.energy -= this.cost;

        this.cooldown = this.cooldownMax;

        this.execute(fighter, enemy);

        return true;
    }

    update() {

        if (this.cooldown > 0) {

            this.cooldown--;
        }
    }
}
