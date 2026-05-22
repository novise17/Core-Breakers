export const arcKnives = {

    name: "Arc Knives",

    energyCost: 12,

    cooldown: 15,

    activate(fighter, enemy) {

        fighter.gainNode();

        const damage = fighter.boostDamage(12);

        enemy.takeHit(
            damage,
            10,
            fighter.facing
        );

        fighter.chainLightning(enemy);
    }
};
