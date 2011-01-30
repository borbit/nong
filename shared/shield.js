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
        this.region.y += this.vy * this.speed / pong.Globals.RFPS;
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
        return this.vy != 0;
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