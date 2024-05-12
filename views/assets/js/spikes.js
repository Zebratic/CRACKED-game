class Spikes {
    constructor(data) {
        this.x = data.x;
        this.y = data.y;
        this.width = data.width;
        this.height = data.height;
        this.renderedSpikes = [];

        // try to fit spikes in the box minimum 10 pixels width, max 20 pixels width, all spikes height is the height of the box
        let spikeCount = Math.floor(this.width / 20);
        let spikeWidth = this.width / spikeCount;
        let spikeHeight = this.height;
        let spikeOffset = 0;

        for (let i = 0; i < spikeCount; i++) {
            let x1 = this.x + spikeOffset;
            let y1 = this.y + spikeHeight;
            let x2 = this.x + spikeOffset + spikeWidth / 2;
            let y2 = this.y;
            let x3 = this.x + spikeOffset + spikeWidth;
            let y3 = this.y + spikeHeight;
            this.renderedSpikes.push({ x1, y1, x2, y2, x3, y3 });
            spikeOffset += spikeWidth;
        }
    }

    draw(debugMode) {
        // draw red box
        //fill(255, 0, 0, 150);
        //rect(this.x, this.y, this.width, this.height);

        // draw spikes
        if (this.renderedSpikes && this.renderedSpikes.length > 0) {
            for (let spike of this.renderedSpikes) {
                fill(255, 0, 0);
                stroke(0);
                triangle(spike.x1, spike.y1, spike.x2, spike.y2, spike.x3, spike.y3);
                noStroke();
            }
        }
        

        if (debugMode) {
            fill(255, 0, 0, 100);
            rect(this.x, this.y, this.width, this.height);
            
            fill(255);
            textSize(16);
            textAlign(CENTER, TOP);
        }
    }

    checkForCollision(player) {
        if (player.position.x + player.width > this.x &&
            player.position.x < this.x + this.width &&
            player.position.y + player.height > this.y &&
            player.position.y < this.y + this.height) {
            return true;
        }   
        return false;
    }
}

export default Spikes;