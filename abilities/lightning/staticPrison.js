export const staticPrison = {

    name: "Static Prison",

    energyCost: 30,

    cooldown: 10,

    activate(fighter, enemy) {

        fighter.gainNode();

        enemy.takeHit(
            fighter.boostDamage(24),
            20,
            fighter.facing
        );

        fighter.chainLightning(enemy);
    }
};
