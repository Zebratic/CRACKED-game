/*
this.player.speed = %{this.player.speed}%;
this.player.gravity = %{this.player.gravity}%;
*/


class Interpreter {
    constructor(player, levelManager) {
        this.player = player;
        this.levelManager = levelManager;
        console.log('Interpreter initialized');
        console.log('Player:', this.player);
        console.log('Level manager:', this.levelManager);
        
        this.errors = [];
    }


    load(gameCode) {
        console.log('Game code:', gameCode);
        var allowedObjects = this.levelManager.currentLevel.allowedObjects;


        try {
            // dont allow console.log etc. and only interact with allowed objects
            var allowedCode = '';
            var variables = gameCode.match(/(var|let|const)\s+\w+\s*=\s*.*?;/g);

            var functions = gameCode.match(/function\s+\w+\s*\([^)]*\)\s*\{[^{}]*\}/g);
            console.log('Variables:', variables);
            console.log('Functions:', functions);

            // declare variables
            if (variables) allowedCode += variables.join('\n') + '\n';
            if (functions) allowedCode += functions.join('\n') + '\n';

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

            // execute the allowed code
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
            

            this.errors = [];
        } catch (error) {
            console.error('Error loading game code:', error);
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
