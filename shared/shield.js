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
        height: 100
    });

    this.startingSpeed = 500;
    this.currentSpeed = 0;
    this.vy = 0;

    this.friction = 50;
    this.currentFriction = 0;
}

utils.inherit(Shield, comps.Element);

utils._.extend(Shield.prototype, {
    update: function(delay) {
        if (this.isMoving()) {
            this.updatePosition(delay);
            this.observer.fire(comps.Element.events.changed);
        }
    },

    updatePosition: function(delay) {
        var deltaT = delay / 1000;
        this.currentSpeed = Math.max(this.currentSpeed - this.currentFriction, 0);
        this.region.y += Math.floor(this.vy * this.currentSpeed * deltaT);
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
        this.currentSpeed = this.startingSpeed;
        this.currentFriction = 0;
    },

    stop: function() {
        this.currentFriction = this.friction;
    },

    isMoving: function() {
        return this.currentSpeed > 0;
    },

    hitStageWall: function(wall) {
        if (this.vy < 0) {
            this.region.y = wall.region.bottom() + 1;
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