class Wall {
    constructor(x, y, w, h, collision = true, color = { r: 255, g: 255, b: 255 }) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.collision = collision;
        this.color = color;
    }

    draw(label = null) {
        fill(this.color.r, this.color.g, this.color.b);
        rect(this.x, this.y, this.w, this.h);

        if (label) {
            textAlign(CENTER, CENTER);
            textSize(16);
            fill((Math.sin(frameCount / 10) + 1) * 127, (Math.sin(frameCount / 10 + 2) + 1) * 127, (Math.sin(frameCount / 10 + 4) + 1) * 127);
            text(label, this.x + this.w / 2, this.y + this.h / 2);
        }
    }
}

export default Wall;