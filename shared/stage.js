(function(ns) {

var hasRequire = (typeof require !== 'undefined'),
    GameLoop = hasRequire ? require('./gameLoop').GameLoop : ns.GameLoop,
    CollisionsDetector = hasRequire ? require('./collisionsDetector').CollisionsDetector : ns.CollisionsDetector,
    Observer = hasRequire ? require('./observer').Observer : ns.Observer;

ns.Stage = function Stage() {
    var gameLoop = GameLoop();
    var observer = Observer();
    var collisionsDetector = CollisionsDetector();

    gameLoop.subscribe(GameLoop.events.tickWithUpdates, function(elements) {
        observer.fire(Stage.events.changed, elements);
    });

    collisionsDetector.subscribe(CollisionsDetector.events.collisionDetected, function(element1, element2) {
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
        collisionsDetector: collisionsDetector,
        start: start,
        stop: stop
    };
};

ns.Stage.events = {
    changed: 'changed'
};

}((typeof exports === 'undefined') ? window.Pong : exports));