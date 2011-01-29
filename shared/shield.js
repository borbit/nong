(function(ns) {

var pong = require('./pong'),
    utils = require('./utils'),
    comps = require('./components');

function Shield(x, y, receiver) {
    this.id = utils.Functions.getUniqId();
    this.observer = utils.Observer();
    
    this.region = comps.Region({
        x: x, y: y,
        width: 10,
        height: 80
    });

    this.speed = 500;
    this.vy = 0;

    var shield = this; //XXX: omg wtf???
    receiver.subscribe(receiver.events.MOVEUP, function() {
        shield.moveUp();
    });

    receiver.subscribe(receiver.events.MOVEDOWN, function() {
        shield.moveDown();
    });

    receiver.subscribe(receiver.events.STOP, function() {
        shield.stop();
    });
}

utils.Functions.inherit(Shield, comps.Element);

utils.Functions.extend(Shield.prototype, {
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
    }
});

ns.Shield = Shield;

}((typeof exports === 'undefined') ? window.Pong : exports));