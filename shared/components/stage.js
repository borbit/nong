(function(ns) {

var utils = require('../utils'),
    components = require('../components')

ns.Stage = function Stage() {
    var observer = utils.Observer(),
        gameLoop = components.GameLoop(),
        elementsDynamic = {}, elementsStatic = {},
        collisionsDetector = components.CollisionsDetector(),
        gameLoopEvents = components.GameLoop.events,
        collisionsEvents = components.CollisionsDetector.events;

    gameLoop.subscribe(gameLoopEvents.tickWithUpdates, function(elements) {
        collisionsDetector.detect();
        observer.fire(Stage.events.changed, elements);
    });

    collisionsDetector.subscribe(collisionsEvents.collisionDetected, function(element1, element2) {
        element1.hit(element2);
        element2.hit(element1);
    });

    function addStaticElement(element) {
        elementsStatic[element.id] = element;
        collisionsDetector.addStaticElement(element);
        return this;
    }

    function addDynamicElement(element) {
        elementsDynamic[element.id] = element;
        gameLoop.addElement(element);
        collisionsDetector.addDynamicElement(element);
        return this;
    }

    function getState() {
        var result = {};
        for(var i in elementsDynamic) {
            result[i] = {
                id: elementsDynamic[i].id,
                x: elementsDynamic[i].region.x,
                y: elementsDynamic[i].region.y
            };
        }
        return result;
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
        getState: getState,
        start: start,
        stop: stop,
        subscribe: observer.subscribe
    };
};

ns.Stage.events = {
    changed: 'changed'
};

}((typeof exports === 'undefined') ? window.Components : exports));