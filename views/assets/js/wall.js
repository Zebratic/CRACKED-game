class Wall {
    constructor(x, y, w, h, collision = true, color = { r: 255, g: 255, b: 255 }) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.collision = collision;
        this.color = color;
    }

    draw() {
        fill(this.color.r, this.color.g, this.color.b);
        rect(this.x, this.y, this.w, this.h);
    }
}

export default Wall;