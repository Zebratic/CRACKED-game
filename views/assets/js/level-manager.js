class Level {
    constructor(data) {
        this.name = data.name;
        this.allowedObjects = data.allowedObjects || [];
        this.startPosition = { x: data.startPosition.x, y: data.startPosition.y };
        this.endPosition = data.endPosition;
        this.walls = data.walls;
        this.enemies = data.enemies;
        this.gravityZones = data.gravityZones;
        this.spikes = data.spikes;
        this.labels = data.labels;
    }
}


class LevelManager {
    constructor() {
        this.currentLevel = null;
        this.levelList = [];
        this.fullLevelList = [];
    }

    async loadLevel(levelId) {
        try {
            const response = await fetch(`levels/${levelId}.json`);
            const data = await response.json();
            const level = new Level(data);
            level.id = levelId;

            console.log(`Loaded level "${levelId}"`, level);
            const scriptResponse = await fetch(`levels/${levelId}.js`);
            level.script = await scriptResponse.text(); ''
            
            console.log(`Loaded script for level "${levelId}"`, level.script);
            this.currentLevel = level;

            return level;
        } catch (error) {
            console.error(`Error loading level "${levelId}":`, error);
            return null;
        }
    }

    async getLevelList() {
        try {
            const response = await fetch('/levels');
            const data = await response.json();
            this.levelList = Object.values(data).flat();
            this.fullLevelList = data;
            return this.levelList;
        } catch (error) {
            console.error('Error loading level list:', error);
            return [];
        }
    }
}

export default LevelManager;
