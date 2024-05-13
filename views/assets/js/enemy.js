class Enemy {
    constructor(data) {
        this.type = data.type;
        this.x = data.x;
        this.y = data.y;
        this.size = data.size;
        this.speed = data.speed;
        this.pathVisible = data.pathVisible;
        this.visible = data.visible;
        this.coordinates = data.coordinates;
        this.targetCoordinate = 0;
        this.color = data.color || { r: 255, g: 0, b: 0, a: 255 };
    }

    move() {
        let target = this.coordinates[this.targetCoordinate];
        let dx = target.x - this.x;
        let dy = target.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 1 * this.speed) {
            this.targetCoordinate++;
            if (this.targetCoordinate >= this.coordinates.length) {
                this.targetCoordinate = 0;
            }
        }

        let angle = Math.atan2(dy, dx);
        this.x += Math.cos(angle) * this.speed;
        this.y += Math.sin(angle) * this.speed;

    }

    draw(debugMode) {
        if (this.pathVisible)
            this.drawPath();

        if (this.visible)  {
            switch (this.type) {
                case 'saw':
                    this.drawSaw();
                    break;
    
                default:
                    fill(this.color.r, this.color.g, this.color.b, 100);
                    rect(this.x - (this.size / 2), this.y - (this.size / 2), this.size, this.size);
            }
        }

        if (debugMode) {
            fill(255, 0, 0, 100);
            stroke(0, 0, 0);
            rect(this.x - (this.size / 2), this.y - (this.size / 2), this.size, this.size);

            let target = this.coordinates[this.targetCoordinate];

            // draw line towards next target
            stroke(255, 0, 0);
            strokeWeight(5);
            line(this.x, this.y, target.x, target.y);
            noStroke();
            strokeWeight(1);

            // draw dot at target
            fill(255, 0, 0);
            stroke(0, 0, 0);
            ellipse(target.x, target.y, 25);
            noStroke();


            // draw all coordinates line path
            for (let i = 0; i < this.coordinates.length - 1; i++) {
                let current = this.coordinates[i];
                let next = this.coordinates[i + 1];
                stroke(255, 255, 0, 100);
                line(current.x, current.y, next.x, next.y);
                noStroke();
                fill(255);
                text("#" + i, current.x, current.y - 7);
            }
            // draw line from last to first coordinate
            let last = this.coordinates[this.coordinates.length - 1];
            let first = this.coordinates[0];
            stroke(255, 255, 0, 100);
            line(last.x, last.y, first.x, first.y);
            noStroke();
            fill(252);
            text("#" + (this.coordinates.length - 1), last.x, last.y - 7);
        }
    }

    checkForCollision(player) {
        if (player.position.x + player.width > this.x - (this.size / 2) &&
            player.position.x < this.x + (this.size / 2) &&
            player.position.y + player.height > this.y - (this.size / 2) &&
            player.position.y < this.y + (this.size / 2)) {
            return true;
        }   
        return false;
    }

    drawPath() {
        // draw the path of the saw in a steam punk style
        for (let i = 0; i < this.coordinates.length - 1; i++) {
            let current = this.coordinates[i];
            let next = this.coordinates[i + 1];
            stroke(20, 20, 20, 200);
            strokeWeight(5);
            line(current.x, current.y, next.x, next.y);
            noStroke();
    
            // make small dot
            fill(20, 20, 20);
            ellipse(current.x, current.y, 10);
        }
    
        // draw line from last to first coordinate
        let last = this.coordinates[this.coordinates.length - 1];
        let first = this.coordinates[0];
        stroke(20, 20, 20, 200);
        strokeWeight(5);
        line(last.x, last.y, first.x, first.y);
        noStroke();
    
        // make small dot
        fill(20, 20, 20, 200);
        ellipse(last.x, last.y, 10);
        strokeWeight(1);
    
    }
    
    drawSaw() {
        push();
        translate(this.x, this.y);
        rotate(frameCount * this.speed / 10);
        fill(70, 70, 70);
        rect(-this.size / 2, -this.size / 2, this.size, this.size);
        rotate(PI / 4);
        fill(100, 100, 100);
        rect(-this.size / 2.2, -this.size / 2.2, this.size / 1.1, this.size / 1.1);
        pop();
    }
}

export default Enemy;