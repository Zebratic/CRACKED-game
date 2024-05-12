// enum of "direction" property "up", "down", "left", "right", "center"
const Direction = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3,
    CENTER: 4
};

class GravityZone {
    constructor(data) {
        this.x = data.x;
        this.y = data.y;
        this.width = data.width;
        this.height = data.height;
        this.gravity = data.gravity;
        this.invisible = data.invisible;
        this.direction = Direction[data.direction.toUpperCase()]; // "up", "down", "left", "right", "center
        this.ignoreWalls = data.ignoreWalls === undefined ? false : data.ignoreWalls;
        this.invisible = data.invisible === undefined ? false : data.invisible;

        this.starDensity = 0.001;
        this.colorIntensity = 255;
        this.stars = [];

        if (!this.invisible) {
            for (let i = 0; i < this.width * this.height * this.starDensity; i++) {
                this.stars.push({
                    x: this.x + random(this.width),
                    y: this.y + random(this.height),
                    size: random(1, 5),
                    opacity: random(100, 255)
                });
            }
        }
    }

    update() {
        for (let star of this.stars) {
            // based on direction, move stars
            switch (this.direction) {
                case Direction.UP:
                    star.y -= this.gravity * 5;
                    if (star.y < this.y) star.y = this.y + this.height;
                    break;

                case Direction.DOWN:
                    star.y += this.gravity * 5;
                    if (star.y > this.y + this.height) star.y = this.y;
                    break;

                case Direction.LEFT:
                    star.x -= this.gravity * 5;
                    if (star.x < this.x) star.x = this.x + this.width;
                    break;

                case Direction.RIGHT:
                    star.x += this.gravity * 5;
                    if (star.x > this.x + this.width) star.x = this.x;
                    break;

                case Direction.CENTER:
                    const center = createVector(this.x + this.width / 2, this.y + this.height / 2);
                    const starPos = createVector(star.x, star.y);
                    const direction = p5.Vector.sub(center, starPos).normalize();
                    star.x += direction.x;
                    star.y += direction.y;
                    if (starPos.dist(center) < 10) {
                        star.x = this.x + random(this.width);
                        star.y = this.y + random(this.height);
                    }
                    break;
            }
        }
    }

    draw(debugMode) {
        // blue stars randomly placed
        for (let star of this.stars) {
            const colorIntensity = map(this.gravity, -2, 2, 0, 255);
            const finalColor = lerpColor(color(0, 0, 255), color(255, 0, 0), colorIntensity / 255);
    
            fill(finalColor);
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

    applyGravity(player, debugMode) {
        if (player.position.x + player.width > this.x &&
            player.position.x < this.x + this.width &&
            player.position.y + player.height > this.y &&
            player.position.y < this.y + this.height &&
            (!player.isOnGround || (this.ignoreWalls && !player.blocked))) {
            //player.velocity.y += this.gravity - player.gravity;

            // apply gravity based on direction
            switch (this.direction) {
                case Direction.UP: player.velocity.y -= this.gravity; break;
                case Direction.DOWN: player.velocity.y += this.gravity + player.gravity; break;
                case Direction.LEFT: player.velocity.x -= this.gravity; break;
                case Direction.RIGHT: player.velocity.x += this.gravity; break;

                case Direction.CENTER:
                    const center = createVector(this.x + this.width / 2, this.y + this.height / 2);
                    const playerPos = createVector(player.position.x + player.width / 2, player.position.y + player.height / 2);
                    const pullDirection = p5.Vector.sub(center, playerPos).normalize();

                    
                    // draw line of direction
                    if (debugMode) {
                        stroke(255, 0, 0);
                        line(playerPos.x, playerPos.y, playerPos.x + pullDirection.x * 100, playerPos.y + pullDirection.y * 100);
                        noStroke();
                    }

                    // pull player towards center, if below center push up, so in the end, the player will be stationary in the center (use player.position.x and player.position.y)
                    const distance = playerPos.dist(center);
                    const pullForce = map(distance, 0, this.height / 2, 0, this.gravity - player.gravity);
                    const pullVector = pullDirection.mult(pullForce);
                    
                    if (playerPos.y > center.y) {
                        console.log('pulling up');
                        player.velocity.y += pullVector.y * 10
                    }
                    else {
                        console.log('pulling down');
                        player.velocity.y += pullVector.y * 5;
                        console.log(player.velocity.y);
                    }
                    player.velocity.x += pullVector.x * 3;

                    // if closer to center, slow down velocity
                    player.velocity.y *= distance < 10 ? 0.9 : 1;
               
                   
                    break;
            }
        }
    }
}

export default GravityZone;