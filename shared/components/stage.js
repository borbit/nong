(function(ns) {

var utils = require('../utils'),
    components = require('../components')

ns.Stage = function Stage() {
    var observer = utils.Observer();
    var gameLoop = components.GameLoop();
    var collisionsDetector = components.CollisionsDetector();
    var gameLoopEvents = components.GameLoop.events;
    var collisionsEvents = components.CollisionsDetector.events;

    gameLoop.subscribe(gameLoopEvents.tickWithUpdates, function(elements) {
        collisionsDetector.detect();
        observer.fire(Stage.events.changed, elements);
    });

    collisionsDetector.subscribe(collisionsEvents.collisionDetected, function(element1, element2) {
        element1.hit(element2);
        element2.hit(element1);
    });

    function addStaticElement(element) {
        collisionsDetector.addStaticElement(element);
        return this;
    }

    function addDynamicElement(element) {
        gameLoop.addElement(element);
        collisionsDetector.addDynamicElement(element);
        return this;
    }

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
        addStaticElement: addStaticElement,
        addDynamicElement: addDynamicElement,
        start: start,
        stop: stop,
        subscribe: observer.subscribe
    };
};

ns.Stage.events = {
    changed: 'changed'
};

}((typeof exports === 'undefined') ? window.Components : exports));