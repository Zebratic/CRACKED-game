class Level {
    constructor(data) {
        this.name = data.name;
        this.allowedObjects = data.allowedObjects || [];
        this.startPosition = createVector(data.startPosition.x, data.startPosition.y);
        this.endPosition = createVector(data.endPosition.x, data.endPosition.y);
        this.walls = data.walls.map(wallData => ({
            x: wallData.x,
            y: wallData.y,
            width: wallData.width,
            height: wallData.height
        }));
    }
}


class LevelManager {
    constructor() {
        this.currentLevel = null;
    }

    async loadLevel(levelId) {
        try {
            const response = await fetch(`levels/${levelId}.json`);
            const data = await response.json();
            const level = new Level(data);
            level.id = levelId;

            console.log(`Loaded level "${levelId}"`, level);
            const scriptResponse = await fetch(`levels/${levelId}-script.bjs`);
            level.script = await scriptResponse.text();
            
            console.log(`Loaded script for level "${levelId}"`, level.script);
            this.currentLevel = level;

            return level;
        } catch (error) {
            console.error(`Error loading level "${levelId}":`, error);
            return null;
        }
    }
}

export default LevelManager;
