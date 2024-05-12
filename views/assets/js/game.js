import Wall from './wall.js';
import LevelManager from './level-manager.js';
import Player from './player.js';
import Enemy from './enemy.js';
import GravityZone from './gravity-zone.js';
import Spikes from './spikes.js';
import Interpreter from './interpreter.js';
import MusicPlayer from './musicplayer.js';
import SpeedrunTimer from './speedrun-timer.js';
import Label from './label.js';
import EndPosition from './end-position.js';
import LevelEditor from './level-editor.js';
import Direction from './directions.js';



let player = new Player();
let levelManager = new LevelManager();
let interpreter = new Interpreter(player, levelManager, null);
let musicPlayer = new MusicPlayer();
let speedrunTimer = new SpeedrunTimer();

levelManager.levelList = await levelManager.getLevelList();


let walls = [];
let enemies = [];
let gravityZones = [];
let spikes = [];
let labels = [];
let endPosition = null;

let levelEditor = new LevelEditor();

function loadLevel(levelName) {
    walls = [];
    enemies = [];
    gravityZones = [];
    spikes = [];
    labels = [];
    endPosition = null;

    levelEditor.currentHeldObject = null;
    levelEditor.lastSelectedObject = null;
    levelEditor.heldObjectOffset = { x: 0, y: 0 };

    player = new Player();
    player.blocked = true;
    

    levelManager.loadLevel(levelName).then(level => {
        if (level) {
            player.position = level.startPosition;
            if (level.walls) walls = level.walls.map(wallData => new Wall(wallData));
            if (level.enemies) enemies = level.enemies.map(enemyData => new Enemy(enemyData));
            if (level.gravityZones) gravityZones = level.gravityZones.map(zoneData => new GravityZone(zoneData));
            if (level.spikes) spikes = level.spikes.map(spikeData => new Spikes(spikeData));
            if (level.labels) labels = level.labels.map(labelData => new Label(labelData));
            if (level.endPosition) endPosition = new EndPosition(level.endPosition);

            interpreter = new Interpreter(player, levelManager, walls, enemies, gravityZones, spikes, labels, endPosition);
            window.interpreter = interpreter;

            var script = interpreter.returnLevelScript(level.script);
            editor.setValue(script);

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
    createCanvas(1920, 1080).parent('game');
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

function OnDeath() {
    console.log('Player died');
    player.position = levelManager.currentLevel.startPosition;
    player.blocked = true;
    editor.setValue(interpreter.returnLevelScript(levelManager.currentLevel.script));
    debugMode = false;
    isRestarting = true;
    restartStopwatch = millis();
}

function draw() {
    // ============= GAME LOOP =============
    background(30, 30, 30);

    // draw gravity zones
    for (let zone of gravityZones) {
        zone.applyGravity(player, debugMode);
        zone.update();
        zone.draw(debugMode);
    }

    // update player
    player.update(walls);
    player.draw();
    

    // draw spikes
    for (let spike of spikes) {
        spike.draw(debugMode);
        if (spike.checkForCollision(player))
            OnDeath();
    }

    // draw walls
    for (let wall of walls) {
        wall.draw(debugMode);
    }
   
    // draw enemies
    for (let enemy of enemies) {
        enemy.move();
        enemy.draw(debugMode);
        if (enemy.checkForCollision(player))
            OnDeath();
    }

    // draw end position
    if (endPosition) {
        endPosition.draw();

        if (endPosition.checkForCollision(player)) {
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

    // draw labels
    for (let label of labels) {
        label.draw(debugMode);
    }



    
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

    if (debugMode)
    {
        player.drawDebug();

        // if editor is open, update it
        var isEditorOpen = editorWindow.getAttribute('editor-hidden') === 'false';
        interpreter.debugMode = !isEditorOpen;
        if (!isEditorOpen)
            levelEditor.update(levelManager, player, walls, enemies, gravityZones, spikes, labels, endPosition);
    }
}



// on key press R, reload the level
window.addEventListener('keydown', function(event) {
    console.log(event.key);
    var isEditorOpen = editorWindow.getAttribute('editor-hidden') === 'false';

    switch (event.key.toLowerCase()) {
        case 'r':
            if (!isRestarting && !isEditorOpen) {
                debugMode = false;
                isRestarting = true;
                restartStopwatch = millis();
            }
            break;

        case 'escape': toggleEditor(); break;
        case 'home': debugMode = !debugMode; break;
        case 'end': levelEditor.saveLevel(); break;
        case 'backspace': levelEditor.deleteObject(debugMode); break;
    }

    // if its a number, load the level index
    if (event.key >= '0' && event.key <= '9' && !isEditorOpen) {
        var levelIndex = parseInt(event.key)
        levelIndex = levelIndex === 0 ? 9 : levelIndex - 1;
        if (levelIndex < levelManager.levelList.length) {
            console.log('Loading level index', levelIndex);
            loadLevel(levelManager.levelList[levelIndex]);
        }
    }
});




window.setup = setup;
window.draw = draw;
window.p5 = p5;
window.editor = editor;

window.interpreter = interpreter;