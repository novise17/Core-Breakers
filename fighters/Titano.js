import { Fighter } from "./Fighter.js";

import { SeismicCrash } from "../abilities/earth/seismicCrash.js";
import { GravitonPull } from "../abilities/earth/gravitonPull.js";
import { StoneMantle } from "../abilities/earth/stoneMantle.js";
import { FaultLine } from "../abilities/earth/faultLine.js";
import { Worldbreaker } from "../abilities/earth/worldbreaker.js";

export class Titano extends Fighter {
    constructor(x, color, controls) {
        super("Titano", x, color, controls);

        this.abilities = {
            q: new SeismicCrash(),
            w: new GravitonPull(),
            e: new StoneMantle(),
            r: new FaultLine(),
            f: new Worldbreaker()
        };

        this.armor = 0;
    }
}
