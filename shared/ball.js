(function(ns) {

var pong = require('./pong'),
    utils = require('./utils'),
    comps = require('./components');

Ball = function(x, y) {
    this.id = utils.Functions.getUniqId();
    this.observer = utils.Observer();
    
    this.region = comps.Region({
        x: x, y: y,
        width: 10,
        height: 10
    });

    this.angle = 45;
    this.kx = 1;
    this.ky = 1;
    this.speed = 500;
}

utils.Functions.inherit(Ball, comps.Element);

utils.Functions.extend(Ball.prototype, {
    update: function() {
        this.updatePosition();
        this.observer.fire(comps.Element.events.changed);
    },

    updatePosition: function() {
        this.region.x += Math.floor(this.kx * Math.abs(Math.cos(this.angle / 180 * Math.PI)) * this.speed / pong.Globals.RFPS);
        this.region.y += Math.floor(this.ky * Math.abs(Math.sin(this.angle / 180 * Math.PI)) * this.speed / pong.Globals.RFPS);
    },

    hitStageWall: function(wall) {
        if (wall.orientation == pong.StageWall.orientation.VERTICAL) {
            //to prevent ball from stucking in the wall
            this.region.x = this.kx > 0 ? wall.region.left() - this.region.width: wall.region.right()
            this.kx = - this.kx;
        }
        else {
            //to prevent ball from stucking in the wall
            this.region.y = this.ky > 0 ? wall.region.top() - this.region.height: wall.region.bottom();
            this.ky = - this.ky;
        }
    },

    hitShield: function(shield) {
        //to prevent ball from stucking in the shield
        this.region.x = this.kx > 0 ? shield.region.left() - this.region.width: shield.region.right();
        
        var ballCenter = parseInt(this.region.y + this.region.height / 2, 10);
        var shieldCenter = parseInt(shield.region.y + shield.region.height / 2, 10);

        var offset = Math.abs(shieldCenter - ballCenter);

        var maxAngleDelta = ns.Ball.angleLimits.MAX - ns.Ball.angleLimits.MIN;
        this.angle = ns.Ball.angleLimits.MIN + maxAngleDelta * offset / (shield.region.height / 2);
        this.kx = - this.kx;
    }
});

ns.Ball = Ball;
ns.Ball.angleLimits = {
    'MIN': 10,
    'MAX': 60
}

}((typeof exports === 'undefined') ? window.Pong : exports));