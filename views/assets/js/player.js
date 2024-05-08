

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
    }

    update(walls) {
        // Player controls
        if (keyIsDown(LEFT_ARROW))
            this.velocity.x -= this.speed;
        if (keyIsDown(RIGHT_ARROW))
            this.velocity.x += this.speed;
    
        // Jumping
        if (keyIsDown(UP_ARROW) && this.isOnGround && this.velocity.y >= 0) {
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
            if (wall.collision && this.position.x + this.width > wall.x && this.position.x < wall.x + wall.w &&
                this.position.y + this.height > wall.y && this.position.y < wall.y + wall.h) {

                // Collision detected, adjust position
                let dx = (this.position.x + this.width / 2) - (wall.x + wall.w / 2);
                let dy = (this.position.y + this.height / 2) - (wall.y + wall.h / 2);
                let overlapX = this.width / 2 + wall.w / 2 - Math.abs(dx);
                let overlapY = this.height / 2 + wall.h / 2 - Math.abs(dy);

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
            if (wall.collision && this.position.x + this.width > wall.x && this.position.x < wall.x + wall.w && this.position.y + this.height === wall.y) {
                isOnGround = true;
                break;
            }
        }
        
        // Check if player is at the bottom of the play area
        if (this.position.y + this.height >= height) {
            isOnGround = true;
        }
        
        // If player is not on the ground, disable jumping
        this.isOnGround = isOnGround;
    }
}

export default Player;