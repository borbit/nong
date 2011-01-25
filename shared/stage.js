(function(ns) {

var hasRequire = (typeof require !== 'undefined'),
    GameLoop = hasRequire ? require('./gameLoop').GameLoop : ns.GameLoop,
    Collisions = hasRequire ? require('./collisions').Collisions : ns.Collisions,
    Observer = hasRequire ? require('./observer').Observer : ns.Observer;

ns.Stage = function Stage() {
    var gameLoop = GameLoop();
    var observer = Observer();
    var collisions = Collisions();

    gameLoop.subscribe(GameLoop.events.tickWithUpdates, function(elements) {
        observer.fire(Stage.events.changed, elements);
    });

    collisions.subscribe(Collisions.events.detected, function(element1, element2) {
        element1.hit(element2);
        element2.hit(element1);
    });

    function start() {
        gameLoop.start();
    }

    function stop() {
        gameLoop.stop();
    }

    return {
        gameLoop: gameLoop,
        observer: observer,
        collisions: collisions,
        start: start,
        stop: stop
    };
};

ns.Stage.events = {
    changed: 'changed'
};

}((typeof exports === 'undefined') ? window.Pong : exports));