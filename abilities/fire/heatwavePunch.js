export const heatwavePunch = {

    name: "Heatwave Punch",

    energyCost: 15,

    cooldown: 15,

    activate(fighter, enemy) {

        // gain heat
        fighter.gainHeat(12);

        // boosted damage
        const damage = fighter.boostDamage(14);

        enemy.takeHit(
            damage,
            14,
            fighter.facing
        );
    }
};
