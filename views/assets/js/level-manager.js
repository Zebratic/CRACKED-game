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
    }

    async loadLevel(levelName) {
        try {
            const response = await fetch(`levels/${levelName}.json`);
            const data = await response.json();
            const level = new Level(data);
            return level;
        } catch (error) {
            console.error(`Error loading level "${levelName}":`, error);
            return null;
        }
    }
}

export default LevelManager;
