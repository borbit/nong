(function(ns) {

var pong = require('./pong'),
    utils = require('./utils'),
    comps = require('./components');

function Ball(id) {
    this.id = id;
    this.observer = utils.Observer();
    
    this.region = comps.Region({
        x: 0, y: 0,
        width: 10,
        height: 10
    });

    this.angle = 45;
    this.kx = 1;
    this.ky = 1;
    this.speed = 500;
    this.isMoving = false;
    this.moveHome();
}

utils.inherit(Ball, comps.Element);

utils._.extend(Ball.prototype, {
    update: function(delay) {
        if (this.isMoving) {
            this.updatePosition(delay);
            this.observer.fire(comps.Element.events.changed);
        }
    },

    updatePosition: function(delay) {
        var deltaT = delay / 1000;

        this.region.x += Math.floor(this.kx * Math.abs(Math.cos(this.angle / 180 * Math.PI)) * this.speed * deltaT);
        this.region.y += Math.floor(this.ky * Math.abs(Math.sin(this.angle / 180 * Math.PI)) * this.speed * deltaT);
    },

    moveHome: function() {
        this.region.x = 400 - this.region.width / 2;
        this.region.y = 300 - this.region.height / 2;
        this.observer.fire(comps.Element.events.changed);
    },

    stop: function() {
        this.isMoving = false;
    },

    preparePitch: function() {
        this.stop();
        this.moveHome();
        this.kx = Math.round(Math.random()) ? 1 : -1;
        this.ky = Math.round(Math.random()) ? 1 : -1;
        this.angle = ns.Ball.angleLimits.MIN;
    },

    pitch: function() {
        this.isMoving = true;
    },

    hitStageWall: function(wall) {
        //to prevent ball from stucking in the wall
        this.region.y = this.ky > 0 ? wall.region.top() - this.region.height: wall.region.bottom();
        this.ky = - this.ky;
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
    },

    serialize: function() {
        return {
            id: this.id,
            kx: this.kx, ky: this.ky,
            x: this.region.x, y: this.region.y,
            angle: this.angle,
            isMoving: this.isMoving
        };
    }
});

ns.Ball = Ball;
ns.Ball.angleLimits = {
    'MIN': 10,
    'MAX': 60
}

}((typeof exports === 'undefined') ? window.Pong : exports));