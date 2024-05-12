

class Player {
    constructor() {
        this.position = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.width = 20;
        this.height = 20;
        this.speed = 1.0;
        this.jumpStrength = 10;
        this.gravity = 0.6; // Adjusted gravity for smoother jumping
        this.friction = 0.8; // Adjusted friction for smoother sliding
        this.isOnGround = false;
        this.terminalVelocity = 15; // Terminal velocity to prevent indefinite acceleration
        this.blocked = false;
    }

    update(walls) {
        // Player controls
        if (keyIsDown(LEFT_ARROW) && !this.blocked)
            this.velocity.x -= this.speed;
        if (keyIsDown(RIGHT_ARROW) && !this.blocked)
            this.velocity.x += this.speed;
    
        // Jumping
        if (keyIsDown(UP_ARROW) && this.isOnGround && this.velocity.y >= 0 && !this.blocked) {
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
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    
        // Collide with walls
        this.collideWalls(walls);
    
        // Collide with screen edges
        this.position.x = constrain(this.position.x, 0, width - this.width);
        this.position.y = constrain(this.position.y, 0, height - this.height);
    }
    

    draw() {
        fill(255, 0, 0);
        rect(this.position.x, this.position.y, this.width, this.height);
    }

    collideWalls(walls) {
        for (let wall of walls) {
            if (wall.collision && this.position.x + this.width > wall.x && this.position.x < wall.x + wall.width &&
                this.position.y + this.height > wall.y && this.position.y < wall.y + wall.height) {

                // Collision detected, adjust position
                let dx = (this.position.x + this.width / 2) - (wall.x + wall.width / 2);
                let dy = (this.position.y + this.height / 2) - (wall.y + wall.height / 2);
                let overlapX = this.width / 2 + wall.width / 2 - Math.abs(dx);
                let overlapY = this.height / 2 + wall.height / 2 - Math.abs(dy);

                if (overlapX < overlapY) {
                    // Colliding from the sides
                    if (dx > 0)
                        this.position.x += overlapX;
                    else
                        this.position.x -= overlapX;

                    this.velocity.x = 0;
                } else {
                    // Colliding from top or bottom
                    if (dy > 0)
                        this.position.y += overlapY;
                    else
                        this.position.y -= overlapY;

                    this.velocity.y = 0;
                    this.isOnGround = dy < 0; // Check if colliding from the top
                }
            }
        }
        
        // Check if player is on the ground
        let isOnGround = false;
        for (let wall of walls) {
            if (wall.collision && this.position.x + this.width > wall.x && this.position.x < wall.x + wall.width && this.position.y + this.height === wall.y) {
                isOnGround = true;
                break;
            }
        }
        
        // Check if player is at the bottom of the play area
        if (this.position.y + this.height >= height) {
            isOnGround = true;
            this.position.y = height - this.height;
            this.velocity.y = 0;
        }
        
        // If player is not on the ground, disable jumping
        this.isOnGround = isOnGround;
    }

    drawDebug() {
        var debugoffsetY = 100;
        fill(255);
        textSize(16);
        textAlign(LEFT, TOP);

        // priny entire player object top left
        var values = Object.values(this);
        for (var i = 0; i < values.length; i++) {
            // if value is p5.Vector, print x and y and limit to 2 decimal places
            if (values[i] instanceof p5.Vector) {
                text(`${Object.keys(this)[i]}: x: ${values[i].x.toFixed(2)}, y: ${values[i].y.toFixed(2)}`, 10, debugoffsetY + i * 20);
            } 
            // else if object expand and print all keys and values in 1 objectline
            else {
                if (typeof values[i] === 'object') {
                    var keys = Object.keys(values[i]);
                    var subValues = Object.values(values[i]);
                    var objectline = `${Object.keys(this)[i]}: `;
                    for (var j = 0; j < keys.length; j++) {
                        if (typeof subValues[j] === 'number') {
                            objectline += `${keys[j]}: ${subValues[j].toFixed(2)} `;
                        } else {
                            objectline += `${keys[j]}: ${subValues[j]} `;
                        }
                    }
                    text(objectline, 10, debugoffsetY + i * 20);
                }
                // else print key and value
                else
                    text(`${Object.keys(this)[i]}: ${values[i]}`, 10, debugoffsetY + i * 20);
            }
        }

        // draw line of velocity
        let center = createVector(this.position.x + this.width / 2, this.position.y + this.height / 2);
        stroke(0, 255, 0);
        line(center.x, center.y, center.x + this.velocity.x * 10, center.y + this.velocity.y * 10);
        noStroke();

    }
}

export default Player;