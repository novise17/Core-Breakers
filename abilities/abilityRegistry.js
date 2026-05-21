// ============================================
// FILE: abilities/abilityRegistry.js
// ============================================

// FIRE
import { firestormBarrage } from "./fire/firestormBarrage.js";
import { heatwavePunch } from "./fire/heatwavePunch.js";
import { ignitionfield } from "./fire/ignitionfield.js";
import { plasmaDash } from "./fire/plasmaDash.js";
import { solarCollapse } from "./fire/solarCollapse.js";

// ICE
import { absoluteZero } from "./ice/absoluteZero.js";
import { cryoLance } from "./ice/cryoLance.js";
import { crystalWall } from "./ice/crystalWall.js";
import { permafrostChains } from "./ice/permafrostChains.js";
import { zeroField } from "./ice/zeroField.js";

// LIGHTNING
import { arcKnives } from "./lightning/arcKnives.js";
import { empPulse } from "./lightning/empPulse.js";
import { railstep } from "./lightning/railstep.js";
import { staticPrison } from "./lightning/staticPrison.js";
import { thunderGodProtocol } from "./lightning/thunderGodProtocol.js";

// EARTH
import { faultLine } from "./earth/faultLine.js";
import { gravitationalPull } from "./earth/gravitationalPull.js";
import { seismicCrash } from "./earth/seismicCrash.js";
import { stoneMantle } from "./earth/stoneMantle.js";
import { worldbreaker } from "./earth/worldbreaker.js";

// COSMIC
import { gravityRift } from "./cosmic/gravityRift.js";
import { nebulaBurst } from "./cosmic/nebulaBurst.js";
import { orbitShift } from "./cosmic/orbitShift.js";
import { pulsarBeam } from "./cosmic/pulsarBeam.js";
import { supernovaAscension } from "./cosmic/supernovaAscension.js";

// SHADOW
import { abyssTrap } from "./shadow/abyssTrap.js";
import { eclipseDomain } from "./shadow/eclipseDomain.js";
import { nightfallSlash } from "./shadow/nightfallSlash.js";
import { shadowClone } from "./shadow/shadowClone.js";
import { voidStep } from "./shadow/voidStep.js";

export const AbilityRegistry = {

    fire: [
        firestormBarrage,
        heatwavePunch,
        ignitionfield,
        plasmaDash,
        solarCollapse
    ],

    ice: [
        absoluteZero,
        cryoLance,
        crystalWall,
        permafrostChains,
        zeroField
    ],

    lightning: [
        arcKnives,
        empPulse,
        railstep,
        staticPrison,
        thunderGodProtocol
    ],

    earth: [
        faultLine,
        gravitationalPull,
        seismicCrash,
        stoneMantle,
        worldbreaker
    ],

    cosmic: [
        gravityRift,
        nebulaBurst,
        orbitShift,
        pulsarBeam,
        supernovaAscension
    ],

    shadow: [
        abyssTrap,
        eclipseDomain,
        nightfallSlash,
        shadowClone,
        voidStep
    ]
};
