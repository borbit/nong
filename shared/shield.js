(function(ns) {

var hasRequire = (typeof require !== 'undefined'),
    Functions = (hasRequire) ? require('./functions') : ns.Functions,
    Element = hasRequire ? require('./element').Element : ns.Element,
    Region = hasRequire ? require('./region').Region : ns.Region,
    Globals = hasRequire ? require('./globals') : ns.Globals;

function Shield(x, y) {
    this.id = Functions.getUniqId();
    
    this.region = Region({
        x: x, y: y,
        width: 10,
        height: 80
    });

    this.speed = 500;
    this.vy = 0;
}

Functions.inherit(Shield, Element);

Functions.extend(Shield.prototype, {
    updatePosition: function() {
        this.region.y += this.vy * this.speed / Globals.RFPS;
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