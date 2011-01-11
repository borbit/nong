(function(ns) {

var hasRequire = (typeof require !== 'undefined'),
    Globals = hasRequire ? require('globals') : ns.Globals,
    Observer = (hasRequire) ? require('observer') : ns.Observer;

ns.Updaters = {};
ns.Updaters.events = {
    changed: 'changed',
    changingStarted: 'changingStarted',
    changingFinished: 'changingFinished'
};

ns.Updaters.Shield = function(shield, publisher) {
    var speed = 500;
    var moveUp = false;
    var moveDown = false;
    var observer = Observer();
    observer.register(ns.Updaters.events.changed);
    observer.register(ns.Updaters.events.changingStarted);
    observer.register(ns.Updaters.events.changingFinished);

    publisher.subscribe(publisher.events.moveUp, function() {
        if(!moveUp) {
            moveUp = true;
        }

        observer.changingStarted();
    });
    publisher.subscribe(publisher.events.moveDown, function() {
        if(!moveDown) {
            moveDown = true;
        }

        observer.changingStarted();
    });
    publisher.subscribe(publisher.events.stop, function() {
        moveUp = false;
        moveDown = false;
        observer.changingFinished();
    });

    function update() {
        if(moveUp) {
            shield.region.y -= parseInt(speed / Globals.RFPS);
        }

        if(moveDown) {
            shield.region.y += parseInt(speed / Globals.RFPS);
        }

        if(moveUp || moveDown) {
            observer.changed();
        }
    }

    return {
        element: shield,
        update: update,
        subscribe: observer.subscribe
    };
};

ns.Updaters.Ball = function(ball) {
    var speed = 400;
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

ns.Updaters.Ball.events = {
    changed: 'changed'
};

}((typeof exports === 'undefined') ? window.Pong : exports));