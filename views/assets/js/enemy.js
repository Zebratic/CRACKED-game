/*
"enemies": [
    {
      "type": "saw",
      "x": 150,
      "y": 300,
      "size": 50,
      "speed": 1,
      "coordinates": [
        {
          "x": 150,
          "y": 300
        },
        {
          "x": 200,
          "y": 300
        }
      ]
    },
    {
      "type": "saw",
      "x": 300,
      "y": 260,
      "size": 20,
      "speed": 1,
      "coordinates": [
        {
          "x": 300,
          "y": 260
        },
        {
          "x": 400,
          "y": 260
        }
      ]
    }
  ]
  */


 // spinning 4 rectangles to create a saw
function drawSaw(x, y, size) {
    push();
    translate(x, y);
    rotate(frameCount / 10.0);
    fill(255, 0, 0);
    rect(-size / 2, -size / 2, size, size);
    rotate(PI / 2);
    fill(255, 255, 0);
    rect(-size / 2, -size / 2, size, size);
    rotate(PI / 2);
    fill(255, 0, 255);
    rect(-size / 2, -size / 2, size, size);
    rotate(PI / 2);
    fill(0, 255, 255);
    rect(-size / 2, -size / 2, size, size);
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