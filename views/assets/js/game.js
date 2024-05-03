class Player {
    constructor() {
        this.position = createVector(400, 300);
        this.velocity = createVector(0, 0);
        this.width = 20;
        this.height = 20;
        this.speed = 1.0;
        this.jumpStrength = 10;
        this.gravity = 0.6; // Adjusted gravity for smoother jumping
        this.friction = 0.8; // Adjusted friction for smoother sliding
        this.isOnGround = false;
        this.terminalVelocity = 15; // Terminal velocity to prevent indefinite acceleration
    }

    update() {
        // Player controls
        if (keyIsDown(LEFT_ARROW))
            this.velocity.x -= this.speed;
        if (keyIsDown(RIGHT_ARROW))
            this.velocity.x += this.speed;
    
        // Jumping
        if ((keyIsDown(UP_ARROW) && this.isOnGround) || (keyIsDown(UP_ARROW) && this.position.y + this.height >= height)) {
            this.velocity.y = -this.jumpStrength;
            this.isOnGround = false;
        }
    
        // Apply gravity
        this.velocity.y += this.gravity;
        // Limit vertical velocity to terminal velocity
        this.velocity.y = constrain(this.velocity.y, -this.terminalVelocity, this.terminalVelocity);
    
        // Apply friction
        this.velocity.x *= this.friction;
    
        // Update position
        this.position.add(this.velocity);
    
        // Collide with walls
        this.collideWalls();
    
        // Collide with screen edges
        this.position.x = constrain(this.position.x, 0, width - this.width);
        this.position.y = constrain(this.position.y, 0, height - this.height);
    }

    draw() {
        fill(255, 0, 0);
        rect(this.position.x, this.position.y, this.width, this.height);
    }

    collideWalls() {
        for (let wall of walls) {
            if (this.position.x + this.width > wall.x && this.position.x < wall.x + wall.w &&
                this.position.y + this.height > wall.y && this.position.y < wall.y + wall.h) {
                // Collision detected, adjust position
                let dx = (this.position.x + this.width / 2) - (wall.x + wall.w / 2);
                let dy = (this.position.y + this.height / 2) - (wall.y + wall.h / 2);
                let overlapX = this.width / 2 + wall.w / 2 - abs(dx);
                let overlapY = this.height / 2 + wall.h / 2 - abs(dy);

                if (overlapX < overlapY) {
                    // Colliding from the sides
                    if (dx > 0) this.position.x += overlapX;
                    else this.position.x -= overlapX;
                    this.velocity.x = 0;
                } else {
                    // Colliding from top or bottom
                    if (dy > 0) this.position.y += overlapY;
                    else this.position.y -= overlapY;
                    this.velocity.y = 0;
                    this.isOnGround = dy < 0; // Check if colliding from the top
                }
            }
        }
    }
}

class Wall {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw() {
        fill(255);
        rect(this.x, this.y, this.w, this.h);
    }
}

let walls = [];
let player;

function setup() {
    createCanvas(1200, 1000).parent('game');
    player = new Player();
    
    for (let i = 0; i < 20; i++) {
        walls.push(new Wall(random(0, width), random(0, height), random(20, 100), random(20, 100)));
    }
}

function draw() {
    background(0);
    player.update();
    player.draw();

    for (let wall of walls) {
        wall.draw();
    }
}