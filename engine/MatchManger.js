// ============================================
// FILE: engine/matchManager.js
// ============================================

export class MatchManager {

    constructor(player1, player2) {

        this.player1 = player1;
        this.player2 = player2;

        // ROUND SETTINGS
        this.maxRounds = 3; // best of 3

        this.roundTime = 180; // 3 minutes

        this.timer = this.roundTime;

        this.currentRound = 1;

        this.roundOver = false;

        this.matchOver = false;

        // SCORE
        this.score = {
            p1: 0,
            p2: 0
        };

        this.lastTime = performance.now();
    }

    // ============================
    // RESET ROUND
    // ============================

    resetRound() {

        this.player1.x = 200;

        this.player2.x = 900;

        this.player1.y = 0;

        this.player2.y = 0;

        this.player1.health = 100;

        this.player2.health = 100;

        this.player1.energy = 100;

        this.player2.energy = 100;

        this.player1.hitstun = 0;

        this.player2.hitstun = 0;

        this.timer = this.roundTime;

        this.roundOver = false;
    }

    // ============================
    // UPDATE TIMER
    // ============================

    update() {

        const now = performance.now();

        const delta = (now - this.lastTime) / 1000;

        this.lastTime = now;

        if (this.matchOver) return;

        if (!this.roundOver) {

            this.timer -= delta;

            if (this.timer <= 0) {

                this.timer = 0;

                this.endRoundByTime();
            }

            this.checkWinCondition();
        }
    }

    // ============================
    // WIN CHECK
    // ============================

    checkWinCondition() {

        if (this.player1.health <= 0) {

            this.score.p2++;

            this.endRound();
        }

        if (this.player2.health <= 0) {

            this.score.p1++;

            this.endRound();
        }
    }

    // ============================
    // END ROUND
    // ============================

    endRound() {

        this.roundOver = true;

        if (this.score.p1 >= 2 || this.score.p2 >= 2) {

            this.matchOver = true;

            return;
        }

        setTimeout(() => {

            this.currentRound++;

            this.resetRound();

        }, 2000);
    }

    // ============================
    // TIME OUT
    // ============================

    endRoundByTime() {

        if (this.player1.health > this.player2.health) {

            this.score.p1++;

        } else if (this.player2.health > this.player1.health) {

            this.score.p2++;

        } else {

            // draw → no score
        }

        this.endRound();
    }
}
