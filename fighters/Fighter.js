export class Fighter {
    constructor(name, x, color, controls) {
        this.name = name;

        this.x = x;
        this.y = 0;

        this.width = 60;
        this.height = 120;

        this.velocityY = 0;
        this.speed = 6;
        this.jumpForce = -15;

        this.gravity = 0.7;

        this.color = color;

        this.health = 100;

        this.isGrounded = false;
        this.isAttacking = false;

        this.controls = controls;

        this.facing = 1; // 1 = right, -1 = left
    }

    move(keys, canvas) {
        if (keys[this.controls.left]) {
            this.x -= this.speed;
            this.facing = -1;
        }

        if (keys[this.controls.right]) {
            this.x += this.speed;
            this.facing = 1;
        }

        if (keys[this.controls.jump] && this.isGrounded) {
            this.velocityY = this.jumpForce;
            this.isGrounded = false;
        }

        // apply gravity
        this.y += this.velocityY;
        this.velocityY += this.gravity;

        // floor collision
        if (this.y + this.height >= canvas.height) {
            this.y = canvas.height - this.height;
            this.velocityY = 0;
            this.isGrounded = true;
        }
    }

    attack(opponent) {
        if (this.isAttacking) return;

        this.isAttacking = true;

        const hitbox = {
            x: this.facing === 1 ? this.x + this.width : this.x - 40,
            y: this.y + 30,
            width: 40,
            height: 30
        };

        if (
            hitbox.x < opponent.x + opponent.width &&
            hitbox.x + hitbox.width > opponent.x &&
            hitbox.y < opponent.y + opponent.height &&
            hitbox.y + hitbox.height > opponent.y
        ) {
            opponent.health -= 10;
        }

        setTimeout(() => {
            this.isAttacking = false;
        }, 150);
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // optional hitbox debug
        if (this.isAttacking) {
            ctx.fillStyle = "yellow";
            ctx.fillRect(
                this.facing === 1 ? this.x + this.width : this.x - 40,
                this.y + 30,
                40,
                30
            );
        }
    }
}
