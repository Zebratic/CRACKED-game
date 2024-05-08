import LevelManager from './level-manager.js';
import Player from './player.js';
import Interpreter from './interpreter.js';

class Wall {
    constructor(x, y, w, h, collision = true, color = { r: 255, g: 255, b: 255 }) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.collision = collision;
        this.color = color;
    }

    draw() {
        fill(this.color.r, this.color.g, this.color.b);
        rect(this.x, this.y, this.w, this.h);
    }
}

let walls = [];
let player = new Player();
let levelManager = new LevelManager();
let interpreter = new Interpreter(player, levelManager);

function setup() {
    createCanvas(1000, 800).parent('game');

    levelManager.loadLevel('level1').then(level => {
        if (level) {
            player.position = level.startPosition;
            walls = level.walls.map(wallData => new Wall(wallData.x, wallData.y, wallData.width, wallData.height));

            var script = interpreter.returnLevelScript(level.script);
            editor.setValue(script);

            // add wall with no collision to indicate the end of the level
            walls.push(new Wall(level.endPosition.x, level.endPosition.y, 15, 15, false, { r: 0, g: 255, b: 0 }));
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
window.editor = editor;

window.interpreter = interpreter;