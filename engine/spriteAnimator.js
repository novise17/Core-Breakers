export class SpriteAnimator {

    constructor(image, frameWidth, frameHeight, frameCount, fps = 10) {

        this.image = image;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;

        this.frameCount = frameCount;

        this.currentFrame = 0;
        this.tick = 0;
        this.fps = fps;
    }

    update() {

        this.tick++;

        if (this.tick >= this.fps) {

            this.tick = 0;
            this.currentFrame++;

            if (this.currentFrame >= this.frameCount) {

                this.currentFrame = 0;
            }
        }
    }

    draw(ctx, x, y, w, h, flip = false) {

        ctx.save();

        if (flip) {

            ctx.scale(-1, 1);
            x = -x - w;
        }

        ctx.drawImage(
            this.image,
            this.currentFrame * this.frameWidth,
            0,
            this.frameWidth,
            this.frameHeight,
            x,
            y,
            w,
            h
        );

        ctx.restore();
    }
}
