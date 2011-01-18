(function(ns) {

var hasRequire = (typeof require !== 'undefined'),
    Globals = hasRequire ? require('globals') : ns.Globals,
    Observer = hasRequire ? require('observer') : ns.Observer;

ns.Updaters = {};
ns.Updaters.events = {
    changed: 'changed',
    stopped: 'stopped'
};

ns.Updaters.Shield = function(shield, stageRegion) {
    var speed = 500;
    var movingUp = false;
    var movingDown = false;
    var observer = Observer();
    observer.register(ns.Updaters.events.changed);
    observer.register(ns.Updaters.events.stopped);

    function update() {
        var delta = parseInt(speed / Globals.RFPS);
        if(movingUp) {
            shield.region.y -= Math.min(delta, Math.abs(stageRegion.top() - shield.region.top()));
            observer.changed();
        }
        if(movingDown) {
            shield.region.y += Math.min(delta, Math.abs(stageRegion.bottom() - shield.region.bottom()));
            observer.changed();
        }
        if ((shield.region.top() == stageRegion.top()) || (shield.region.bottom() == stageRegion.bottom())) {
            observer.stopped();
        }
    }

    function moveUp() {
        movingUp = true;
        movingDown = false;
    }

    function moveDown() {
        movingUp = false;
        movingDown = true;
    }

    function stop() {
        movingUp = false;
        movingDown = false;
    }

    return {
        stop: stop,
        moveUp: moveUp,
        moveDown: moveDown,
        update: update,
        element: shield,
        subscribe: observer.subscribe
    };
};

ns.Updaters.Ball = function(ball) {
    var speed = 700;
    var observer = Observer();
    observer.register(ns.Updaters.events.changed);

    function update() {
        ball.region.x += ball.vx * speed / Globals.RFPS;
        ball.region.y += ball.vy * speed / Globals.RFPS;
        observer.changed();
    }

    return {
        element: ball,
        update: update,
        subscribe: observer.subscribe
    };
};

}((typeof exports === 'undefined') ? window.Pong : exports));