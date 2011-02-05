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

    this.speed = 500;
    this.vy = 0;

    this.energy = 0;
}

utils.inherit(Shield, comps.Element);

utils._.extend(Shield.prototype, {
    updateEnergy: function() {
        if (this.vy == 0 && this.energy != 0) {
            this.energy += - Math.round(this.energy / Math.abs(this.energy));
        } else if (this.vy) {
            if (Math.abs(this.energy + this.vy) <= 8) {
                this.energy += this.vy;
            }
        }
    },

    update: function(delay) {
        if (this.isMoving()) {
            //this.updateEnergy();
            this.updatePosition(delay);
            this.observer.fire(comps.Element.events.changed);
        }
    },

    updatePosition: function(delay) {
        var deltaT = delay / 1000;
        this.region.y += /*this.energy * */ this.vy * this.speed * deltaT;
    },

    moveTo: function(y) {
        this.region.y = y;
        this.observer.fire(comps.Element.events.changed);
    },

    moveUp: function() {
        this.vy = -1;
    },

    moveDown: function() {
        this.vy = 1;
    },

    stop: function() {
        this.vy = 0;
    },

    isMoving: function() {
        return /*this.energy != 0 ||*/ this.vy != 0;
    },

    hitStageWall: function(wall) {
        if (this.vy < 0) {
            this.region.y = wall.region.bottom();
        } else if (this.vy > 0) {
            this.region.y = wall.region.top() - this.region.height;
        }

        //this.energy *= -1;
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