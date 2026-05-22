// engine/frameClock.js

export class FrameClock {
  constructor(game) {
    this.game = game;
    this.frame = 0;
  }

  tick(keys) {
    const { p1, p2, hitboxSystem } = this.game;

    this.frame++;

    // 1. INPUT PHASE
    p1.inputBuffer.update();
    p2.inputBuffer.update();

    // 2. STATE PHASE (stun timers, recovery, etc.)
    p1.update();
    p2.update();

    // 3. MOVEMENT PHASE
    p1.processMovementAndBufferedInputs(keys, this.game.canvas);
    p2.processMovementAndBufferedInputs(keys, this.game.canvas);

    // 4. COMBAT RESOLUTION PHASE
    hitboxSystem.resolveFrameCollision(p1, p2);
    hitboxSystem.resolveFrameCollision(p2, p1);

    // 5. CLEANUP PHASE (optional future use)
    this.resolveEndOfFrame(p1, p2);
  }

  resolveEndOfFrame(p1, p2) {
    // placeholder for:
    // - combo decay rules
    // - frame advantage logging
    // - debug snapshots (future rollback)
  }
}
