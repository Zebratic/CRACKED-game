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
            fill(255 - this.color.r, 255 - this.color.g, 255 - this.color.b);
            text(label, this.x + this.w / 2, this.y + this.h / 2);
        }
    }
}

export default Wall;