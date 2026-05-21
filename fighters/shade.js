import { Fighter } from "./Fighter.js";

import { VoidStep } from "../abilities/shadow/voidStep.js";
import { ShadowClone } from "../abilities/shadow/shadowClone.js";
import { AbyssTrap } from "../abilities/shadow/abyssTrap.js";
import { NightfallSlash } from "../abilities/shadow/nightfallSlash.js";
import { EclipseDomain } from "../abilities/shadow/eclipseDomain.js";

export class Shade extends Fighter {
    constructor(x, color, controls) {
        super("Shade", x, color, controls);

        this.abilities = {
            q: new VoidStep(),
            w: new ShadowClone(),
            e: new AbyssTrap(),
            r: new NightfallSlash(),
            f: new EclipseDomain()
        };

        this.inShadowForm = false;
    }
}
