export const firestormBarrage = {

    name: "Firestorm Barrage",

    energyCost: 30,

    cooldown: 15,

    activate(fighter, enemy) {

        fighter.gainHeat(25);

        enemy.takeHit(
            fighter.boostDamage(24),
            22,
            fighter.facing
        );
    }
};
