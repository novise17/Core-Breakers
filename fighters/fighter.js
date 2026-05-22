export class Fighter {
  constructor(name, x, color, controls) {
    this.name = name;
    this.x = x;
    this.y = 400;
    this.color = color;
    this.controls = controls;

    this.width = 60;
    this.height = 120;

    this.hp = 100;

    this.speed = 5;
    this.velocityY = 0;
    this.gravity = 0.7;
    this.jumpPower = -12;
    this.grounded = false;

    this.facing = 1;
  }

  update(keys, canvas, enemy) {
    // MOVE
    if (keys[this.controls.left]) {
      this.x -= this.speed;
      this.facing = -1;
    }

    if (keys[this.controls.right]) {
      this.x += this.speed;
      this.facing = 1;
    }

    // JUMP
    if (keys[this.controls.jump] && this.grounded) {
      this.velocityY = this.jumpPower;
      this.grounded = false;
    }

    // ATTACK
    if (keys[this.controls.attack]) {
      this.attack(enemy);
    }

    // PHYSICS
    this.y += this.velocityY;
    this.velocityY += this.gravity;

    if (this.y >= 400) {
      this.y = 400;
      this.velocityY = 0;
      this.grounded = true;
    }

    // CLAMP
    this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
  }

  attack(enemy) {
    const inRange =
      Math.abs(this.x - enemy.x) < 70 &&
      Math.abs(this.y - enemy.y) < 50;

    if (inRange) {
      enemy.hp -= 5;
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
