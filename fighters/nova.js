import { Fighter } from "./Fighter.js";

import { PulsarBeam } from "../abilities/cosmic/pulsarBeam.js";
import { GravityRift } from "../abilities/cosmic/gravityRift.js";
import { NebulaBurst } from "../abilities/cosmic/nebulaBurst.js";
import { OrbitShift } from "../abilities/cosmic/orbitShift.js";
import { SupernovaAscension } from "../abilities/cosmic/supernovaAscension.js";

export class Nova extends Fighter {
    constructor(x, color, controls) {
        super("Nova", x, color, controls);

        this.abilities = {
            q: new PulsarBeam(),
            w: new GravityRift(),
            e: new NebulaBurst(),
            r: new OrbitShift(),
            f: new SupernovaAscension()
        };

        this.cosmicCharge = 0;
    }
}
