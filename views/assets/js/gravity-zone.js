/*
"gravityZones": [
    {
      "x": 150,
      "y": 300,
      "width": 50,
      "height": 20,
      "gravity": 0
    },
    {
      "x": 300,
      "y": 260,
      "width": 100,
      "height": 20,
      "gravity": 0
    },
    {
      "x": 500,
      "y": 220,
      "width": 100,
      "height": 20,
      "gravity": 0
    }
  ]
  */


class GravityZone {
    constructor(data) {
        this.x = data.x;
        this.y = data.y;
        this.width = data.width;
        this.height = data.height;
        this.gravity = data.gravity;
        this.starDensity = 0.001;
        this.stars = [];

        for (let i = 0; i < this.width * this.height * this.starDensity; i++) {
            this.stars.push({
                x: this.x + random(this.width),
                y: this.y + random(this.height),
                size: random(1, 5),
                opacity: random(100, 255)
            });
        }
    }

    update() {
        for (let star of this.stars) {
            star.x += random(-0.5, 0.5);
            star.y += random(-0.5, 0.5);

            if (star.x < this.x) star.x = this.x;
            if (star.x > this.x + this.width) star.x = this.x + this.width;
            if (star.y < this.y) star.y = this.y;
            if (star.y > this.y + this.height) star.y = this.y + this.height;
        }
    }

    draw(debugMode) {
        // blue stars randomly placed
        for (let star of this.stars) {
            fill(50, 255, 255, star.opacity);
            noStroke();
            ellipse(star.x, star.y, star.size);
        }

        if (debugMode) {
            fill(0, 0, 255, 100);
            rect(this.x, this.y, this.width, this.height);
            
            fill(255);
            textSize(16);
            textAlign(CENTER, TOP);
            text(`Gravity: ${this.gravity}`, this.x + this.width / 2, this.y + this.height / 2);
        }
    }

    applyGravity(player) {
        if (player.position.x + player.width > this.x &&
            player.position.x < this.x + this.width &&
            player.position.y + player.height > this.y &&
            player.position.y < this.y + this.height &&
            !player.isOnGround) {
            player.velocity.y += this.gravity;
        }
    }
}

export default GravityZone;