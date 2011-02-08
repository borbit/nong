(function(ns) {
var pong = require('./pong'),
    utils = require('./utils'),
    comps = require('./components');

function Shield(x, y, id) {
    this.id = id;
    this.observer = utils.Observer();

    this.region = comps.Region({
        x: x, y: y,
        width: 10,
        height: 80
    });

    this.startingSpeed = 300;
    this.currentSpeed = 0;
    this.vy = 0;

    this.acceleration = 5;
    this.currentAcceleration = 0;
    this.friction = 2;
    this.movementTime = 0;
}

utils.inherit(Shield, comps.Element);

utils._.extend(Shield.prototype, {
    update: function() {
        if (this.isMoving()) {
            this.updatePosition();
            this.observer.fire(comps.Element.events.changed);
        }
    },

    updatePosition: function() {
        this.movementTime += 1;
        this.currentSpeed = Math.max(this.currentSpeed + this.movementTime * (this.currentAcceleration - this.friction), 0);
        this.region.y += this.vy * this.currentSpeed / pong.Globals.RFPS;
    },

    moveTo: function(y) {
        this.region.y = y;
        this.observer.fire(comps.Element.events.changed);
    },

    moveUp: function() {
        if (this.vy > 0) {
            this.stop();
        }
        this.vy = -1;
        this.startMovement();
    },

    moveDown: function() {
        if (this.vy < 0) {
            this.stop();
        }
        this.vy = 1;
        this.startMovement();
    },

    startMovement: function() {
        this.currentAcceleration = this.acceleration;
        this.currentSpeed = this.startingSpeed;
    },

    stop: function() {
        this.movementTime = 0;
        this.currentAcceleration = 0;
    },

    isMoving: function() {
        return this.currentSpeed > 0;
    },

    hitStageWall: function(wall) {
        if (this.vy < 0) {
            this.region.y = wall.region.bottom();
        }
        else if (this.vy > 0) {
            this.region.y = wall.region.top() - this.region.height;
        }
        this.stop();
    },

    serialize: function() {
        return {
            id: this.id,
            x: this.region.x,
            y: this.region.y
        };
    }
});

ns.Shield = Shield;

}((typeof exports === 'undefined') ? window.Pong : exports));