// spinning 4 rectangles to create a saw
function drawSaw(x, y, size) {
    push();
    translate(x, y);
    rotate(frameCount / 10.0);
    fill(70, 70, 70);
    rect(-size / 2, -size / 2, size, size);
    rotate(PI / 4);
    fill(100, 100, 100);
    rect(-size / 2.2, -size / 2.2, size / 1.1, size / 1.1);
    pop();
}


class Enemy {
    constructor(data) {
        this.type = data.type;
        this.x = data.x;
        this.y = data.y;
        this.size = data.size;
        this.speed = data.speed;
        this.coordinates = data.coordinates;
        this.targetCoordinate = 0;
        this.color = { r: 255, g: 0, b: 0 };
    }

    move() {
        let target = this.coordinates[this.targetCoordinate];
        let dx = target.x - this.x;
        let dy = target.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.speed) {
            this.x = target.x;
            this.y = target.y;
            this.targetCoordinate = (this.targetCoordinate + 1) % this.coordinates.length;
        } else {
            this.x += dx / distance * this.speed;
            this.y += dy / distance * this.speed;
        }
    }

    draw() {
        switch (this.type) {
            case 'saw':
                drawSaw(this.x, this.y, this.size);
                break;

            default:
                fill(this.color.r, this.color.g, this.color.b);
                rect(this.x, this.y, this.size, this.size);
        }
    }
}

export default Enemy;