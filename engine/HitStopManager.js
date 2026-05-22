// engine/hitStopManager.js

export class HitStopManager {
  constructor() {
    this.timer = 0;
    this.globalSlow = 1;
  }

  trigger(frames = 6) {
    this.timer = Math.max(this.timer, frames);
  }

  update() {
    if (this.timer > 0) {
      this.timer--;
      this.globalSlow = 0; // freeze simulation
    } else {
      this.globalSlow = 1;
    }
  }

  isFrozen() {
    return this.timer > 0;
  }
}
