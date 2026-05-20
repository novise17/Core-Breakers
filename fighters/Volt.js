import { Fighter } from "./Fighter.js";

import { Railstep } from "../abilities/lightning/railstep.js";
import { ArcKnives } from "../abilities/lightning/arcKnives.js";
import { EMPPulse } from "../abilities/lightning/empPulse.js";
import { StaticPrison } from "../abilities/lightning/staticPrison.js";
import { ThunderGodProtocol } from "../abilities/lightning/thunderGodProtocol.js";

export class Volt extends Fighter {
    constructor(x, color, controls) {
        super("Volt", x, color, controls);

        this.abilities = {
            q: new Railstep(),
            w: new ArcKnives(),
            e: new EMPPulse(),
            r: new StaticPrison(),
            f: new ThunderGodProtocol()
        };

        this.overcharged = false;
    }
}
