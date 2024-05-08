class GravityZone {
    constructor() {
        this.gravity = 0.5;
        this.friction = 0.95;
        this.bounce = -0.7;
    }

    applyGravity(obj) {
        obj.vy += this.gravity;
    }

    applyFriction(obj) {
        obj.vx *= this.friction;
    }

    applyBounce(obj) {
        obj.vy *= this.bounce;
    }
}

export default GravityZone;