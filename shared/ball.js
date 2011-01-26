(function(ns) {

var hasRequire = (typeof require !== 'undefined'),
    Functions = (hasRequire) ? require('./functions') : ns.Functions,
    Element = hasRequire ? require('./element').Element : ns.Element,
    Region = hasRequire ? require('./region').Region : ns.Region,
    StageWall = hasRequire ? require('./stageWall').StageWall : ns.StageWall,
    Observer = hasRequire ? require('./observer').Observer : ns.Observer,
    Globals = hasRequire ? require('./globals') : ns.Globals;

Ball = function(x, y) {
    this.id = Functions.getUniqId();
    this.observer = Observer();
    
    this.region = Region({
        x: x, y: y,
        width: 10,
        height: 10
    });

    this.angle = 45;
    this.kx = 1;
    this.ky = 1;
    this.speed = 500;
}

Functions.inherit(Ball, Element);

Functions.extend(Ball.prototype, {
    update: function() {
        this.updatePosition();
        this.observer.fire(Element.events.changed);
    },

    updatePosition: function() {
        this.region.x += this.kx * Math.abs(Math.cos(this.angle / 180 * Math.PI)) * this.speed / Globals.RFPS;
        this.region.y += this.ky * Math.abs(Math.sin(this.angle / 180 * Math.PI)) * this.speed / Globals.RFPS;
    },

    hitStageWall: function(wall) {
        if (wall.orientation == StageWall.orientation.VERTICAL) {
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