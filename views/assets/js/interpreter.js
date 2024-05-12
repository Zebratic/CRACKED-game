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

        this.errors = [];
        this.libraries = [
            'console',
            'Math'
        ];
    }


    load(gameCode) {
        console.log('Updating objects');

        var allowedObjects = this.levelManager.currentLevel.allowedObjects;

        try {
            var allowedCode = '';
            allowedCode += this.libraries.map(lib => `var ${lib} = window.${lib};`).join('\n');
             
            // const, let, var variables also check for multi line declarations
            var variables = gameCode.match(/(?:const|let|var)\s+\w+\s*=\s*[^;]+;/gs) || [];
            var functions = gameCode.match(/function\s+\w+\s*\([^)]*\)\s*\{[^{}]*\}/g) || [];
            var executableLines = gameCode.match(/[^{};]+;/g);
            console.log('Variables:', variables);
            console.log('Functions:', functions);
            console.log('Executable Lines:', executableLines);

            // go through executable lines and check if line matches allowed objects regex
            if (executableLines) {
                executableLines = executableLines.filter(line => {
                    for (let object of allowedObjects) {
                        const objectRegex = new RegExp(`\\b${object}\\b`);
                        if (objectRegex.test(line)) return true;
                    }
                });
            }

            console.log('Executable Lines after filtering:', executableLines);

            // add allowed code to allowedCode
            if (variables) allowedCode += variables.join('\n');
            if (functions) allowedCode += functions.join('\n');
            if (executableLines) allowedCode += executableLines.join('\n');

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

        // use regex to replace values `${this.walls[0].collision}` with actual values
        bjsScript = bjsScript.replace(/`\$\{([^}]+)\}`/g, (match) => {
            var expression = match.slice(2, -1);
            try {
                console.log('Evaluating expression:', expression);
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
