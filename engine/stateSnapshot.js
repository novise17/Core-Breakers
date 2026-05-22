export class StateSnapshot {
  static captureState(gameState) {
    return {
      gameState: gameState.state,
      player1: this.serializeFighter(gameState.player1),
      player2: this.serializeFighter(gameState.player2)
    };
  }

  static restoreState(gameState, snapshot) {
    if (!snapshot) return;
    gameState.state = snapshot.gameState;

    if (gameState.player1 && snapshot.player1)
      this.deserializeFighter(gameState.player1, snapshot.player1);

    if (gameState.player2 && snapshot.player2)
      this.deserializeFighter(gameState.player2, snapshot.player2);
  }

  static serializeFighter(f) {
    if (!f) return null;

    return {
      x: f.x,
      y: f.y,
      velocityY: f.velocityY,
      isGrounded: f.isGrounded,
      health: f.health,
      energy: f.energy,
      hitstun: f.hitstun,
      blockstun: f.blockstun,
      actionState: f.actionState,
      stateTimer: f.stateTimer,
      facing: f.facing,
      isCounterHitWindow: f.isCounterHitWindow,
      actionQueue: f.actionQueue,
      cooldowns: { ...f.cooldowns },
      state: { ...f.state }
    };
  }

  static deserializeFighter(f, d) {
    Object.assign(f, {
      x: d.x,
      y: d.y,
      velocityY: d.velocityY,
      isGrounded: d.isGrounded,
      health: d.health,
      energy: d.energy,
      hitstun: d.hitstun,
      blockstun: d.blockstun,
      actionState: d.actionState,
      stateTimer: d.stateTimer,
      facing: d.facing,
      isCounterHitWindow: d.isCounterHitWindow,
      actionQueue: d.actionQueue,
      cooldowns: d.cooldowns,
      state: d.state
    });
  }
}
