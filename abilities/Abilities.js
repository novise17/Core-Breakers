export class Ability {
    constructor({ name, cooldown = 1000, energyCost = 10 }) {
        this.name = name;
        this.cooldown = cooldown;
        this.energyCost = energyCost;

        this.lastUsed = 0;
    }

    canUse(fighter) {
        return (
            Date.now() - this.lastUsed >= this.cooldown &&
            fighter.energy >= this.energyCost
        );
    }

    use(fighter, enemy) {
        if (!this.canUse(fighter)) return false;

        this.lastUsed = Date.now();
        fighter.energy -= this.energyCost;

        this.activate(fighter, enemy);

        return true;
    }

    activate(fighter, enemy) {
        // override
    }
}
