export class CharacterSelect {

    constructor(availableFighters, onStartFight) {

        this.fighters = availableFighters;

        this.onStartFight = onStartFight;

        this.selectedP1 = 0;
        this.selectedP2 = 1;

        this.lockedP1 = false;
        this.lockedP2 = false;

        this.keys = {};
    }

    update(keys) {

        this.keys = keys;

        // P1 controls (A/D + lock = F)
        if (!this.lockedP1) {

            if (keys["a"]) this.selectedP1--;
            if (keys["d"]) this.selectedP1++;

            if (this.selectedP1 < 0) this.selectedP1 = this.fighters.length - 1;
            if (this.selectedP1 >= this.fighters.length) this.selectedP1 = 0;

            if (keys["f"]) this.lockedP1 = true;
        }

        // P2 controls (← → + lock = Enter)
        if (!this.lockedP2) {

            if (keys["ArrowLeft"]) this.selectedP2--;
            if (keys["ArrowRight"]) this.selectedP2++;

            if (this.selectedP2 < 0) this.selectedP2 = this.fighters.length - 1;
            if (this.selectedP2 >= this.fighters.length) this.selectedP2 = 0;

            if (keys["Enter"]) this.lockedP2 = true;
        }

        // START FIGHT
        if (this.lockedP1 && this.lockedP2) {

            this.onStartFight(
                this.fighters[this.selectedP1],
                this.fighters[this.selectedP2]
            );
        }
    }

    draw(ctx, canvas) {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";

        ctx.fillText("ECHOES OF ASHERYA", canvas.width / 2, 80);

        // GRID
        for (let i = 0; i < this.fighters.length; i++) {

            const x = 100 + i * 150;
            const y = 200;

            const f = this.fighters[i];

            ctx.fillStyle = f.color;
            ctx.fillRect(x, y, 80, 120);

            // CORE label
            ctx.fillStyle = "white";
            ctx.font = "14px Arial";
            ctx.fillText(f.core, x + 40, y + 140);

            // P1 highlight
            if (i === this.selectedP1) {

                ctx.strokeStyle = "lime";
                ctx.strokeRect(x, y, 80, 120);
            }

            // P2 highlight
            if (i === this.selectedP2) {

                ctx.strokeStyle = "cyan";
                ctx.strokeRect(x + 5, y + 5, 70, 110);
            }

            // locked indicators
            if (this.lockedP1 && i === this.selectedP1) {

                ctx.fillStyle = "lime";
                ctx.fillText("P1 READY", x + 40, y - 10);
            }

            if (this.lockedP2 && i === this.selectedP2) {

                ctx.fillStyle = "cyan";
                ctx.fillText("P2 READY", x + 40, y - 30);
            }
        }

        ctx.fillStyle = "gray";
        ctx.fillText("P1: A/D + F | P2: ← → + ENTER", canvas.width / 2, canvas.height - 60);
    }
}
