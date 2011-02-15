(function(ns) {

var pong = require('./pong'),
    utils = require('./utils'),
    comps = require('./components');

function Ball(id) {
    this.snapshotsBuffer = [];
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
    this.speed = 200;
    this.isMoving = false;
    this.targetSnapshot = null;

    this.moveHome();
}

utils.inherit(Ball, comps.Element);

utils._.extend(Ball.prototype, {
    updateState: function(data) {
        this.targetSnapshot = null;
        this.snapshotsBuffer = [];
        this.region.x = data.x;
        this.region.y = data.y;
        this.kx = data.kx;
        this.ky = data.ky;
        this.angle = data.angle;
        this.isMoving = data.isMoving;
        this.speed = data.speed;
    },

    update: function(delay) {
        if (this.client) {
            if (this.targetSnapshot) {
//                console.log('rx: ' + this.region.x);
//                console.log('tsx: ' + this.targetSnapshot.data.x);
//                console.log('yx: ' + this.region.y);
//                console.log('tsy: ' + this.targetSnapshot.data.y);
                if (Math.abs(this.region.x - this.targetSnapshot.data.x) < 5
                    && Math.abs(this.region.y - this.targetSnapshot.data.y) < 5) {
//                    console.log('ts = null');
                    this.targetSnapshot = null;
                    this.snapshotsBuffer.splice(0, 1);
                }
            }

            if (this.snapshotsBuffer.length >= 2 && !this.targetSnapshot) {
                var startingSnapshot = this.snapshotsBuffer[0];
                this.targetSnapshot = this.snapshotsBuffer[1];

                var timeDelta = (this.targetSnapshot.timestamp - startingSnapshot.timestamp) / 1000;
//                console.log(timeDelta);
//                console.log('x:' + this.region.x);
//                console.log('y:' + this.region.y);

                this.kx = startingSnapshot.data.kx;
                this.ky = startingSnapshot.data.ky;
                this.angle = startingSnapshot.data.angle;
                this.isMoving = startingSnapshot.data.isMoving;

                var dx = Math.abs(this.targetSnapshot.data.x - startingSnapshot.data.x);
                var dy = Math.abs(this.targetSnapshot.data.y - startingSnapshot.data.y);

                //if (dx > dy) {
                    this.speed = Math.abs(dx / (this.kx * Math.abs(Math.cos(this.angle / 180 * Math.PI)) * timeDelta));
                    console.log(timeDelta, dx, this.speed);
                    //this.speed = dx / this.kx * Math.abs(Math.cos(this.angle / 180 * Math.PI)) * deltaT
                //}
                //else {
                //    this.speed = Math.abs(dy / (this.kx * Math.abs(Math.sin(this.angle / 180 * Math.PI)) * timeDelta));
                //}
            }
        }

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
        if (!this.client) {
            //to prevent ball from stucking in the shield
            this.region.x = this.kx > 0 ? shield.region.left() - this.region.width: shield.region.right();

            var ballCenter = parseInt(this.region.y + this.region.height / 2, 10);
            var shieldCenter = parseInt(shield.region.y + shield.region.height / 2, 10);

            var offset = Math.abs(shieldCenter - ballCenter);

            var maxAngleDelta = ns.Ball.angleLimits.MAX - ns.Ball.angleLimits.MIN;
            this.angle = ns.Ball.angleLimits.MIN + maxAngleDelta * offset / (shield.region.height / 2);
            this.kx = - this.kx;
        }
    },

    serialize: function() {
        return {
            id: this.id,
            kx: this.kx, ky: this.ky,
            x: this.region.x, y: this.region.y,
            angle: this.angle,
            isMoving: this.isMoving,
            speed: this.speed
        };
    }
});

ns.Ball = Ball;
ns.Ball.angleLimits = {
    'MIN': 10,
    'MAX': 60
}

}((typeof exports === 'undefined') ? window.Pong : exports));