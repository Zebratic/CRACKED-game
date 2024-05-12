class MusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.audio.volume = 0.1;
    }

    load(url) {
        return new Promise((resolve, reject) => {
            this.audio.addEventListener('canplaythrough', () => {
                resolve();
            });
            this.audio.addEventListener('error', () => {
                reject();
            });
            this.audio.src = url;
            this.audio.loop = true;
            this.audio.load();
        });
    }

    play() {
        this.audio.play();
    }

    pause() {
        this.audio.pause();
    }

    restart() {
        this.audio.currentTime = 0;
    }
}

export default MusicPlayer;