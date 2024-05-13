///////////////////////////////////////////////
//  Anything written here will be executed!  //
///////////////////////////////////////////////

// this.player.KEY = VALUE;

`${Object.keys(this.player).map(key => `this.player.${key} = ${this.player[key]};`).join('\n')}$`




this.player;
this.levelManager;
this.walls;
this.enemies;
this.gravityZones;
this.spikes;
this.labels;
this.endPosition;