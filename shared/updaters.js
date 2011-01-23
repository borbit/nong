(function(ns) {

var hasRequire = (typeof require !== 'undefined'),
    Globals = hasRequire ? require('./globals') : ns.Globals,
    Observer = hasRequire ? require('./observer').Observer : ns.Observer;

ns.Updaters = {};
ns.Updaters.events = {
    changed: 'changed'
};

ns.Updaters.Shield = function(shield) {
    var observer = Observer();

    function update() {
        if (shield.isMoving()) {
            shield.updatePosition();
            observer.fire(ns.Updaters.events.changed);
        }
    }

    return {
        update: update,
        element: shield,
        subscribe: observer.subscribe
    };
};

ns.Updaters.Ball = function(ball) {
    var observer = Observer();

    function update() {
        ball.updatePosition();
        observer.fire(ns.Updaters.events.changed);
    }

    return {
        element: ball,
        update: update,
        subscribe: observer.subscribe
    };
};

}((typeof exports === 'undefined') ? window.Pong : exports));