// ============================================
// FILE: engine/tournamentManager.js
// ============================================

export class TournamentManager {

    constructor(fighters) {

        this.fighters = fighters;

        this.currentMatchIndex = 0;

        this.bracket = this.createBracket(fighters);

        this.winner = null;
    }

    // ============================
    // CREATE BRACKET
    // ============================

    createBracket(fighters) {

        const shuffled = fighters.sort(() => Math.random() - 0.5);

        const matches = [];

        for (let i = 0; i < shuffled.length; i += 2) {

            matches.push({
                p1: shuffled[i],
                p2: shuffled[i + 1],
                winner: null
            });
        }

        return matches;
    }

    // ============================
    // GET CURRENT MATCH
    // ============================

    getCurrentMatch() {

        return this.bracket[this.currentMatchIndex];
    }

    // ============================
    // SET WINNER
    // ============================

    setWinner(winner) {

        this.bracket[this.currentMatchIndex].winner = winner;

        this.currentMatchIndex++;

        if (this.currentMatchIndex >= this.bracket.length) {

            this.winner = winner;

            console.log("TOURNAMENT WINNER:", winner.name);
        }
    }
}
