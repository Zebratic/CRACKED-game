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
            var allowedCode = this.libraries.map(lib => `var ${lib} = window.${lib};`).join('\n') + '\n';

            // remove comments
            gameCode = gameCode.replace(/\/\*[\s\S]*?\*\//g, '');
            gameCode = gameCode.replace(/\/\/.*/g, '');
             
            // const, let, var variables also check for multi line declarations
            var variables = gameCode.match(/(?:const|let|var)\s+\w+\s*=\s*[^;]+;/gs) || [];
            var functions = gameCode.match(/function\s+\w+\s*\([^)]*\)\s*\{[^{}]*\}/g) || [];

            // split by new line and remove empty lines
            var executableLines = gameCode.split('\n').filter(line => line.trim() !== '');

            // go through executable lines and check if line matches allowed objects regex
            if (executableLines) {
                executableLines = executableLines.filter(line => {
                    for (let object of allowedObjects) {
                        const objectRegex = new RegExp(`\\b${object}\\b`);
                        if (objectRegex.test(line))
                            return true;
                    }
                });
            }


            // add allowed code to allowedCode
            if (variables) allowedCode += variables.join('\n');
            if (functions) allowedCode += functions.join('\n');
            if (executableLines) allowedCode += executableLines.join('\n');

            console.log('==== Executing Code ====', '\n' + allowedCode + '\n' + '==== End Code ====');
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
        bjsScript = bjsScript.replace(/`\$\{([^}`]+).*\}\$`/g, match => {
            match = match.replace('`${', '').replace('}$`', '');
            try {
                console.log('Evaluating expression:', match);
                return eval(match);
            } catch (error) {
                console.error(`Error evaluating expression "${match}":`, error);
                return `null /* Error evaluating expression "${match}": ${error} */`;
            }
        });

        return bjsScript;
    }
}

export default Interpreter;
