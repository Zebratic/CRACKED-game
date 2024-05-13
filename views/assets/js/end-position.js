class EndPosition {
    constructor(data) {
        this.x = data.x;
        this.y = data.y;
        this.width = data.width;
        this.height = data.height;
        this.color = data.color || { r: 255, g: 255, b: 255, a: 255 };
    }

    draw(debugMode) {
        fill(this.color.r, this.color.g, this.color.b, this.color.a);
        rect(this.x, this.y, this.width, this.height);

        if (debugMode) {
            textAlign(CENTER, CENTER);
            textSize(16);
            fill((Math.sin(frameCount / 10) + 1) * 127, (Math.sin(frameCount / 10 + 2) + 1) * 127, (Math.sin(frameCount / 10 + 4) + 1) * 127);
            text(this.x + 'x' + this.y, this.x + this.width / 2, this.y + this.height / 2);
        }
    }

    checkForCollision(player) {
        return player.position.x + player.width > this.x &&
            player.position.x < this.x + this.width &&
            player.position.y + player.height > this.y &&
            player.position.y < this.y + this.height;
    }
}

export default EndPosition;



