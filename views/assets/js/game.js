class Player {
    constructor() {
        this.position = new p5.Vector(0, 0);
        this.speed = 1;
        this.gravity = 0.1;
        this.width = 10;
        this.height = 10;
        this.isFalling = false;
        this.acceleration = 0;
        this.velocity = 0;
    }

    move() {
        let currentPos = this.position.copy();
        let canMove = true;

        if (keyIsDown(LEFT_ARROW))  currentPos.x -= this.speed;
        if (keyIsDown(RIGHT_ARROW)) currentPos.x += this.speed;

        if (currentPos.y + this.height > height) {
            this.isFalling = false;
            this.acceleration = 0;
            this.velocity = 0;
            currentPos.y = height - this.height;
        }

        if (this.isFalling) {
            this.acceleration += this.gravity;
            this.velocity += this.acceleration;
            currentPos.y += this.velocity;
        }

        if (keyIsDown(UP_ARROW) && !this.isFalling) {
            this.isFalling = true;
            this.acceleration = -2;
            this.velocity = -2;
        }

        for (let wall of walls) {
            if (currentPos.x < wall.x + wall.w &&
                currentPos.x + this.width > wall.x &&
                currentPos.y < wall.y + wall.h &&
                currentPos.y + this.height > wall.y) {
                canMove = false;
            }

            // if wall is below player, stop falling
            if (currentPos.x < wall.x + wall.w &&
                currentPos.x + this.width > wall.x &&
                currentPos.y + this.height < wall.y + wall.h &&
                currentPos.y + this.height > wall.y) {
                this.isFalling = false;
                this.acceleration = 0;
                this.velocity = 0;
                currentPos.y = wall.y - this.height;
                canMove = false;
            }
        }

        // update position if allowed to move
        if (canMove) {
            this.position = currentPos;
        }
    }

    draw() {
        fill(255, 0, 0);
        rect(this.position.x, this.position.y, this.width, this.height);
    }
}

class Wall {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}


function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



let player = new Player();
let walls = [];

// make random walls
for (let i = 0; i < 10; i++) {
    walls.push(new Wall(random(0, 800), random(0, 600), random(10, 100), random(10, 100)));
}



function setup() {
    // create canvas on id=game
    createCanvas(800, 600).parent('game');
}

function draw() {
    background(0);
    fill(255);
   
    // draw player
    player.move();
    player.draw();

    // draw walls
    for (let wall of walls) {
        fill(255);
        rect(wall.x, wall.y, wall.w, wall.h);
    }
}

