class LevelEditor {
    constructor() {
        this.currentHeldObject = null;
        this.lastSelectedObject = null;
        this.heldObjectOffset = { x: 0, y: 0 };

        this.levelManager = null;
        this.player = null;
        this.walls = [];
        this.enemies = [];
        this.gravityZones = [];
        this.spikes = [];
        this.labels = [];
        this.endPosition = null;
    }

    update(levelManager, player, walls, enemies, gravityZones, spikes, labels, endPosition) {
        this.levelManager = levelManager;
        this.player = player;
        this.walls = walls;
        this.enemies = enemies;
        this.gravityZones = gravityZones;
        this.spikes = spikes;
        this.labels = labels;
        this.endPosition = endPosition;

        // collect a list of all objects
        let objectLists = [this.walls, this.enemies, this.gravityZones, this.spikes, this.labels, this.endPosition];

        const allObjects = objectLists.flat();

        // if mouse is is clicked on nothing, deselect object
        if (mouseIsPressed && this.lastSelectedObject !== null && this.currentHeldObject === null) {
            this.lastSelectedObject = null;
            return;
        }

        // loop through all objects
        for (let object of allObjects) {
            if (object == null) continue;

            let draggable = this.calculateDraggability(object);

            // if mouse is let go, stop dragging
            if (!mouseIsPressed && this.currentHeldObject === object) {
                this.currentHeldObject = null;
            }

            if (draggable && mouseIsPressed && this.currentHeldObject === null) {
                this.currentHeldObject = object;
                this.lastSelectedObject = object;
                this.heldObjectOffset = { x: object.x - mouseX, y: object.y - mouseY };
            }

            if (object === this.currentHeldObject && mouseIsPressed)
            {
                this.moveObject(object);
                break;
            }
        };

       // if a selected object is being dragged, show edit menu
        if (this.lastSelectedObject !== null && mouseIsPressed) {
            this.UpdateJson(this.lastSelectedObject);
        }
    }

    // function to calculate draggability based on mouse position
    calculateDraggability(object) {
        if (object != null) {
            if (mouseX > object.x && mouseX < object.x + object.width && mouseY > object.y && mouseY < object.y + object.height) {
                return true;
            }
        }

        return false;
    }


    // function to move an object
    moveObject(object) {
        // draw dot at mouse position
        fill(255, 0, 0);
        noStroke();
        ellipse(mouseX, mouseY, 5);

        // move object to mouse position
        object.x = mouseX + this.heldObjectOffset.x;
        object.y = mouseY + this.heldObjectOffset.y;
    }

    UpdateJson(object) {
        let ObjectJSON = JSON.stringify(object, null, 2);
        editor.setValue(ObjectJSON);
    }

    saveLevel() {
        // go through gravityZones and revert direction: 0 = up, 1 = down, 2 = left, 3 = right, 4 = center
        for (let zone of this.gravityZones) {
            switch (zone.direction) {
                case 0: zone.direction = "UP"; break;
                case 1: zone.direction = "DOWN"; break;
                case 2: zone.direction = "LEFT"; break;
                case 3: zone.direction = "RIGHT"; break;
                case 4: zone.direction = "CENTER"; break;
            }

            if (zone.stars) delete zone.stars;
        }

        // remove renderedSpikes
        for (let spike of this.spikes) {
            let index = this.spikes.indexOf(spike);
            if (this.spikes[index].renderedSpikes)
                delete this.spikes[index].renderedSpikes;
        }


        let level = {
            name: this.levelManager.currentLevel.name,
            allowedObjects: this.levelManager.currentLevel.allowedObjects,
            startPosition: { x: Math.floor(this.player.position.x), y: Math.floor(this.player.position.y)},
            endPosition: this.endPosition,
            walls: this.walls,
            enemies: this.enemies,
            gravityZones: this.gravityZones,
            spikes: this.spikes,
            labels: this.labels
        };

        // remove width and height from labels
        for (let label of level.labels) {
            delete label.width;
            delete label.height;
        }

        let levelJSON = JSON.stringify(level, null, 2);
        console.log(levelJSON);

        // save to levels folder as CustomLevel-<timestamp>.json
        let timestamp = new Date().getTime();
        let filename = `CustomLevel-${timestamp}.json`;
        let blob = new Blob([levelJSON], { type: 'application/json' });
        let url = URL.createObjectURL(blob);

        let a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
    }

    deleteObject(debugMode) {
        if (!debugMode) return;

        console.log('Deleting object:', this.lastSelectedObject);
        if (this.lastSelectedObject !== null) {
            let objectLists = [this.walls, this.enemies, this.gravityZones, this.spikes, this.labels, this.endPosition];
            for (let list of objectLists) {
                let index = list.indexOf(this.lastSelectedObject);
                if (index > -1) {
                    list.splice(index, 1);
                    this.lastSelectedObject = null;
                    break;
                }
            }
        }
    }
}

export default LevelEditor;