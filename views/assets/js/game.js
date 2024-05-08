import Wall from './wall.js';
import LevelManager from './level-manager.js';
import Player from './player.js';
import Enemy from './enemy.js';
import Interpreter from './interpreter.js';
import MusicPlayer from './musicplayer.js';
import SpeedrunTimer from './speedrun-timer.js';


let player = new Player();
let levelManager = new LevelManager();
let interpreter = new Interpreter(player, levelManager);
let musicPlayer = new MusicPlayer();
let speedrunTimer = new SpeedrunTimer();

levelManager.levelList = await levelManager.getLevelList();


let walls = [];
let enemies = [];

function loadLevel(levelName) {
    walls = [];
    enemies = [];
    player = new Player();
    player.blocked = true;
    interpreter = new Interpreter(player, levelManager);
    window.interpreter = interpreter;

    levelManager.loadLevel(levelName).then(level => {
        if (level) {
            player.position = level.startPosition;
            if (level.walls)
                walls = level.walls.map(wallData => new Wall(wallData.x, wallData.y, wallData.width, wallData.height));
            
            if (level.enemies)
                enemies = level.enemies.map(enemyData => new Enemy(enemyData));

            var script = interpreter.returnLevelScript(level.script);
            editor.setValue(script);

            // add wall with no collision to indicate the end of the level
            walls.push(new Wall(level.endPosition.x, level.endPosition.y, 15, 15, false, { r: 0, g: 255, b: 0 }));

            // reset speedrun timer
            speedrunTimer.reset();

            setTimeout(() => {
                player.blocked = false;
                speedrunTimer.start(level.id);
            }, 500);

        }
    });
}

var debugMode = false;
var musicStarted = false;

var isRestarting = false;
var isLevelLoaded = false;
var restartStopwatch = 0;

function setup() {

    createCanvas(1000, 800).parent('game');
    loadLevel(levelManager.levelList[0]);

    // on any mouse click, play the music
    window.addEventListener('click', function() {
        if (!musicStarted) {
            musicPlayer.load('/assets/sound/music.mp3');
            musicPlayer.play();
            musicStarted = true;
        }
    });
}


function draw() {
    // ============= GAME LOOP =============
    background(30, 30, 30);
    player.update(walls);
    player.draw(debugMode);

    for (let wall of walls) {
        wall.draw((debugMode ? '#' + (walls.indexOf(wall) + 1) + ' x: ' + wall.x + ', y: ' + wall.y : null));
    }

    // draw enemies
    for (let enemy of enemies) {
        enemy.move();
        enemy.draw();
    }

    // check for player-enemy collision
    for (let enemy of enemies) {
        // draw hitbox
        if (debugMode) {
            fill(255, 0, 0, 100);
            rect(enemy.x - (enemy.size / 2), enemy.y - (enemy.size / 2), enemy.size, enemy.size);
        }
        if (player.position.x + player.width > enemy.x - (enemy.size / 2) &&
            player.position.x < enemy.x + (enemy.size / 2) &&
            player.position.y + player.height > enemy.y - (enemy.size / 2) &&
            player.position.y < enemy.y + (enemy.size / 2)) {
            console.log('Player died');
            player.position = levelManager.currentLevel.startPosition;
            player.blocked = true;

            // restart level
            isRestarting = true;
            restartStopwatch = millis();
        }
    }





    // ============= LEVEL COMPLETION =============
    if (levelManager.currentLevel && levelManager.currentLevel.endPosition) {
        if (player.position.x + player.width > levelManager.currentLevel.endPosition.x &&
            player.position.x < levelManager.currentLevel.endPosition.x + 15 &&
            player.position.y + player.height > levelManager.currentLevel.endPosition.y &&
            player.position.y < levelManager.currentLevel.endPosition.y + 15) {
            
            // stop speedrun timer
            speedrunTimer.stop();
            speedrunTimer.saveHighscore(levelManager.currentLevel.id);

            console.log('Level completed in', speedrunTimer.formatTime(speedrunTimer.currentTime));
                
            // load next level
            var levelIndex = levelManager.levelList.indexOf(levelManager.currentLevel.id);

            if (levelIndex < levelManager.levelList.length - 1)
            {
                // load next level with animation
                levelManager.currentLevel.id = levelManager.levelList[levelIndex + 1];
                isRestarting = true;
                restartStopwatch = millis();
            }
            else
                console.log('All levels completed');
        }
    }
    // =====================================

    

    
    // ============= RESTART ANIMATION =============
    if (isRestarting) {
        var timePassed = millis() - restartStopwatch;
        if (timePassed < 500) {
            fill(255, 255, 255, 255 - timePassed);
            rect(0, 0, width, height);
            if (!isLevelLoaded) {
                isLevelLoaded = true;
                loadLevel(levelManager.currentLevel.id);
            }
        } else {
            isRestarting = false;
            isLevelLoaded = false;
        }
    }
    // =============================================



    // ============= UI OVERLAY =============
    fill(255);
    textSize(16);
    textAlign(LEFT, TOP);
    text('Press R to restart', 10, 10);
    text('Press ESC to toggle editor', 10, 30);
    text('Press I to toggle debug info', 10, 50);

    // draw level name
    if (levelManager.currentLevel)
    {
        textAlign(RIGHT, TOP);
        text(levelManager.currentLevel.name, width - 10, 10);
    }

    // draw speedrun timer
    speedrunTimer.update();
    speedrunTimer.draw();
    // =========================================
}



// on key press R, reload the level
window.addEventListener('keydown', function(event) {
    switch (event.key.toLowerCase()) {
        case 'r':
            if (!isRestarting) {
                isRestarting = true;
                restartStopwatch = millis();
            }
            break;

        case 'escape':
            toggleEditor();
            break;

        case 'i':
            debugMode = !debugMode;
            break;
    }


    if (event.key === 'r') {
        if (!isRestarting) {
            isRestarting = true;
            restartStopwatch = millis();
        }
    }
});




window.setup = setup;
window.draw = draw;
window.p5 = p5;
window.editor = editor;

window.interpreter = interpreter;