class SpeedrunTimer {
    constructor() {
        this.startTime = Date.now();
        this.currentTime = 0;
        this.running = false;

        this.highscores = [];
        this.currentId = null;

        var highscores = localStorage.getItem('highscores');
        if (highscores) {
            this.highscores = JSON.parse(highscores);
        }
    }

    start(levelId) {
        this.startTime = Date.now();
        this.running = true;

        this.currentId = levelId;
    }

    stop() {
        this.currentTime = Date.now() - this.startTime;
        this.running = false;
    }

    reset() {
        this.startTime = Date.now();
        this.currentTime = 0;
        this.running = false;
    }

    saveHighscore(levelId) {
        this.highscores.push({
            levelId: levelId,
            time: this.currentTime
        });

        this.highscores.sort((a, b) => a.time - b.time);
        localStorage.setItem('highscores', JSON.stringify(this.highscores));
    }

    formatTime(time) {
        var minutes = Math.floor(time / 60000);
        var seconds = Math.floor((time % 60000) / 1000);
        var milliseconds = time % 1000;

        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}.${milliseconds < 100 ? '0' : ''}${milliseconds}`;
    }

    draw() {
        fill(255);
        textSize(24);
        textAlign(CENTER, TOP);
        text(this.formatTime(this.currentTime), width / 2, 10);

        let highscore = this.highscores.find(score => score.levelId === this.currentId);
        if (highscore)
        {
            textSize(16);
            fill(this.currentTime > highscore.time ? 100 : 255);
            text('Best: ' + this.formatTime(highscore.time), width / 2, 40);
        }
    }

    update() {
        if (this.running) {
            this.currentTime = Date.now() - this.startTime;
        }
    }
}

export default SpeedrunTimer;