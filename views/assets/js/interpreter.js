const Direction = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3,
    CENTER: 4
};

class Interpreter {
    constructor(player, levelManager, walls, enemies, gravityZones, spikes, labels, endPosition) {
        this.player = player;
        this.levelManager = levelManager;
        this.walls = walls;
        this.enemies = enemies;
        this.gravityZones = gravityZones;
        this.spikes = spikes;
        this.labels = labels;
        this.endPosition = endPosition;

        
        this.debugMode = false;
        this.pastObject = false;
        this.objectToWrite = false;
        console.log('Interpreter initialized');
        console.log('Player:', this.player);
        console.log('Level manager:', this.levelManager);

        this.errors = [];
    }


    load(gameCode) {
        console.log('Updating objects');

        var allowedObjects = this.levelManager.currentLevel.allowedObjects;

        let library = ['console', 'Math'];

        try {
            var allowedCode = '';
            allowedCode += library.map(lib => `var ${lib} = window.${lib};`).join('\n') + '\n';

            var variables = gameCode.match(/(var|let|const)\s+\w+\s*=\s*.*?;/g);
            var functions = gameCode.match(/function\s+\w+\s*\([^)]*\)\s*\{[^{}]*\}/g);
            var executableLines = gameCode.match(/[^{};]+;/g);
            console.log('Variables:', variables);
            console.log('Functions:', functions);
            console.log('Executable Lines:', executableLines);

            // go through executable lines and check if variable is allowed
            if (executableLines) {
                executableLines = executableLines.filter(line => {
                    var variable = line.match(/\b\w+\b/);
                    if (variable && allowedObjects.includes(variable[0])) {
                        return true;
                    } else {
                        console.log('Variable not allowed:', variable);
                        return false;
                    }
                });
            }

            // declare variables
            if (variables) allowedCode += variables.join('\n') + '\n';
            if (functions) allowedCode += functions.join('\n') + '\n';
            if (executableLines) allowedCode += executableLines.join('\n') + '\n';

            // extract allowed code to be executed
            allowedCode += allowedObjects.map(object => {
                const objectRegex = new RegExp(`\\b${object}\\b\\s*=\\s*.*?;`, 'g');
                const objectMatches = gameCode.match(objectRegex);
                if (objectMatches) {
                    return objectMatches.join('\n');
                } else {
                    return '';
                }
            }).join('\n') + '\n';

            console.log('Executing allowed code:', allowedCode);
            eval(allowedCode);

            // delete variables again
            if (variables) {
                variables.forEach(variable => {
                    var name = variable.match(/\b\w+\b/)[0];
                    delete window[name];
                    console.log('Deleted variable:', name);
                });
            }

            // delete functions again
            if (functions) {
                functions.forEach(func => {
                    var name = func.match(/\b\w+\b/)[0];
                    delete window[name];
                    console.log('Deleted function:', name);
                });
            }
            
        } catch (error) {
            console.error('Error executing allowed code:', error);
            this.errors.push(error);
        }
    }

    returnLevelScript(bjsScript) {

        // use regex to replace values %{}% with actual values
        bjsScript = bjsScript.replace(/%{.*?}%/g, match => {
            // evaluate the expression inside the %{}%
            var expression = match.slice(2, -2);

            try {
                return eval(expression);
            } catch (error) {
                console.error(`Error evaluating expression "${expression}":`, error);
                return `null /* Error evaluating expression "${expression}": ${error} */`;
            }
        });

        return bjsScript;
    }
}

export default Interpreter;
