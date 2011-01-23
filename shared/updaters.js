(function(ns) {

var hasRequire = (typeof require !== 'undefined'),
    Observer = hasRequire ? require('observer') : ns.Observer;

ns.Updaters = {};
ns.Updaters.events = {
    changed: 'changed'
};

ns.Updaters.Shield = function(shield) {
    var observer = Observer();
    observer.register(ns.Updaters.events.changed);

    function update() {
        if (shield.isMoving()) {
            shield.updatePosition();
        }
        observer.changed();
    }

    return {
        update: update,
        element: shield,
        subscribe: observer.subscribe
    };
};

ns.Updaters.Ball = function(ball) {
    var observer = Observer();
    observer.register(ns.Updaters.events.changed);

    function update() {
        ball.updatePosition();
        observer.changed();
    }

    return {
        element: ball,
        update: update,
        subscribe: observer.subscribe
    };
};

}((typeof exports === 'undefined') ? window.Pong : exports));