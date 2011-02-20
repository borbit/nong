(function(ns) {

var utils = require('../utils'),
    components = require('../components')

ns.Stage = function Stage(dynamics) {
    var observer = utils.Observer(),
        gameLoop = components.GameLoop(dynamics),
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
        executeCollisionHandler(element1, element2);
        executeCollisionHandler(element2, element1);
    });

    function executeCollisionHandler(element1, element2) {
        var type1 = utils.getTypeName(element1);
        var type2 = utils.getTypeName(element2);
        if (type1 && type2) {
            var handlerName = 'on' + type1 + 'Hits' + type2;
            if (stage[handlerName] != undefined) {
                stage[handlerName](element1, element2);
            }
        }
    }

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

    function serialize() {
        var result = {};
        for(var i in elementsDynamic) {
            result[i] = elementsDynamic[i].serialize();
        }
        return result;
    }

    function start() {
        gameLoop.start();
    }

    function stop() {
        gameLoop.stop();
    }

    var stage = {
        gameLoop: gameLoop,
        observer: observer,
        collisionsDetector: collisionsDetector,
        addStaticElement: addStaticElement,
        addDynamicElement: addDynamicElement,
        serialize: serialize,
        start: start,
        stop: stop,
        subscribe: observer.subscribe
    }
    return stage;
};

ns.Stage.events = {
    changed: 'changed'
};

}((typeof exports === 'undefined') ? window.Components : exports));