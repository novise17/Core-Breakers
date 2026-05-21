// ============================================
// FILE: ui/characterSelect.js
// ============================================

export class CharacterSelect {

    constructor(fighters) {

        this.fighters = fighters;

        this.selectedIndex = 0;

        this.p1Choice = null;

        this.p2Choice = null;

        this.phase = "p1"; // p1 → p2 → done
    }

    handleInput(key) {

        // MOVE LEFT
        if (key === "a" || key === "ArrowLeft") {

            this.selectedIndex =
                (this.selectedIndex - 1 + this.fighters.length) %
                this.fighters.length;
        }

        // MOVE RIGHT
        if (key === "d" || key === "ArrowRight") {

            this.selectedIndex =
                (this.selectedIndex + 1) %
                this.fighters.length;
        }

        // CONFIRM
        if (key === " " || key === "Enter") {

            if (this.phase === "p1") {

                this.p1Choice = this.selectedIndex;

                this.phase = "p2";

            } else if (this.phase === "p2") {

                this.p2Choice = this.selectedIndex;

                this.phase = "done";
            }
        }
    }

    isReady() {

        return this.phase === "done";
    }

    getFighters() {

        return {
            p1: this.fighters[this.p1Choice],

            p2: this.fighters[this.p2Choice]
        };
    }
}
