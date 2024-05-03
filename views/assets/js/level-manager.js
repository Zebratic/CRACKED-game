class Level {
    constructor(data) {
        this.name = data.name;
        this.startPosition = createVector(data.startPosition.x, data.startPosition.y);
        this.endPosition = createVector(data.endPosition.x, data.endPosition.y);
        this.walls = data.walls.map(wallData => ({
            x: wallData.x,
            y: wallData.y,
            width: wallData.width,
            height: wallData.height
        }));
        this.scripts = data.scripts || [];
    }
}


class LevelManager {
    constructor() {
        this.levels = [];
        this.currentLevel = null;
    }

    async loadLevel(levelName) {
        try {
            const response = await fetch(`levels/${levelName}.json`);
            const data = await response.json();
            const level = new Level(data);

            console.log(`Loaded level "${levelName}"`, level);
            const scriptResponse = await fetch(`levels/${levelName}-script.bjs`);
            level.script = await scriptResponse.text();

            return level;
        } catch (error) {
            console.error(`Error loading level "${levelName}":`, error);
            return null;
        }
    }
}

export default LevelManager;
