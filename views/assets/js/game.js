



class Player {
    constructor() {
        this.position = new p5.Vector(400, 300);
        this.velocity = new p5.Vector(0, 0);
        this.width = 20;
        this.height = 20;
        this.speed = 0.8;
        this.jumpHeight = 3;
        this.jumpStrength = 5;
        this.gravity = 1;
        this.friction = 0.9;
        this.isOnGround = false;
    }

    update() {
        // collide with screen floor and ceiling
        if (this.position.y + this.height > height) {
            this.isOnGround = true;
            this.velocity.y = 0;
            this.position.y = height - this.height;
        }

        // collide with screen walls
        if (this.position.x < 0) {
            this.position.x = 0;
        } else if (this.position.x + this.width > width) {
            this.position.x = width - this.width;
        }


        // player controls
        var tempvelocityX = this.velocity.x;
        var tempvelocityY = this.velocity.y;
        if (keyIsDown(LEFT_ARROW))
            tempvelocityX += -this.speed;

        if (keyIsDown(RIGHT_ARROW))
            tempvelocityX += this.speed;

       

        // make terminal velocity but allow for some extra speed (all should depend on gravity)
        this.velocity.x = tempvelocityX;
        this.velocity.y = tempvelocityY;


        let newposX = this.position.x + this.velocity.x;
        let newposY = this.position.y + this.velocity.y;

        // check if player is colliding with walls from top or bottom or sides, and if so, move player to the edge of the wall
        var isInAir = true;
        for (let wall of walls) {
            if (newposX + this.width > wall.x && newposX < wall.x + wall.w && newposY + this.height > wall.y && newposY < wall.y + wall.h) {
                if (newposY + this.height > wall.y && this.position.y + this.height <= wall.y) {
                    newposY = wall.y - this.height;
                    this.velocity.y = 0;
                    this.isOnGround = true;
                    isInAir = false;
                } else if (newposY < wall.y + wall.h && this.position.y >= wall.y + wall.h) {
                    newposY = wall.y + wall.h;
                    this.velocity.y = 0;
                    this.isOnGround = false;
                    isInAir = false;
                } else if (newposX + this.width > wall.x && this.position.x + this.width <= wall.x) {
                    newposX = wall.x - this.width;
                    this.velocity.x = 0;
                } else if (newposX < wall.x + wall.w && this.position.x >= wall.x + wall.w) {
                    newposX = wall.x + wall.w;
                    this.velocity.x = 0;
                }
            }
        }

        // check floor
        if (newposY + this.height > height) {
            newposY = height - this.height;
            this.velocity.y = 0;
            this.isOnGround = true;
            isInAir = false;
        }

        // check ceiling
        if (newposY < 0) {
            newposY = 0;
            this.velocity.y = 0;
        }

        // if player is in air, apply gravity
        if (isInAir) {
            this.velocity.y += this.gravity;
        }
        if (keyIsDown(UP_ARROW) && !isInAir) {
            this.velocity.y = -(this.jumpStrength * this.jumpHeight) / this.gravity;
        }

        // slow down player so it slides a bit
        this.velocity.x *= this.friction;

        // update player
        this.position.x = newposX;
        this.position.y = newposY;
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
        this.collision = false;
    }

    draw() {
        fill(255);
        rect(this.x, this.y, this.w, this.h);
    }
}


let walls = [];
let player = new Player();

function setup() {
    createCanvas(1200, 1000).parent('game');
    
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
