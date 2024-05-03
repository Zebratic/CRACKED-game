import LevelManager from './level-manager.js';
import Player from './player.js';



class Wall {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw() {
        fill(255);
        rect(this.x, this.y, this.w, this.h);
    }
}

let walls = [];
let player = new Player();
let levelManager = new LevelManager();

function setup() {
    createCanvas(1200, 1000).parent('game');

    levelManager.loadLevel('level1').then(level => {
        if (level) {
            player.position = level.startPosition;
            walls = level.walls.map(wallData => new Wall(wallData.x, wallData.y, wallData.width, wallData.height));
        }
    });
}

function draw() {
    background(0);
    player.update(walls);
    player.draw();

    for (let wall of walls) {
        wall.draw();
    }
}


window.setup = setup;
window.draw = draw;
window.p5 = p5;