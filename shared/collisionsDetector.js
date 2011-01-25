(function(ns) {

var hasRequire = (typeof require !== 'undefined'),
    Observer = hasRequire ? require('./observer').Observer : ns.Observer;

ns.CollisionsDetector = function() {
    var observer = Observer();

    var dynamicElements = [];
    var staticElements = [];

    function addStaticElement(element) {
        staticElements.push(element);
    }

    function addDynamicElement(element) {
        dynamicElements.push(element);
    }

    function detectCollisions() {
        var targets = staticElements.concat(dynamicElements);
        while (targets.length > staticElements.length) { // we don't wan't to detect a collision of 2 static objects
            var target = targets.pop();
            for (var j = 0, targetsCount = targets.length; j < targetsCount; ++j) {
                if (target.collidesWith(targets[j])) {
                    observer.fire(ns.CollisionsDetector.events.collisionDetected, target, targets[j]);
                }
            }
        }
    }

    return {
        addStaticElement: addStaticElement,
        addDynamicElement: addDynamicElement,
        subscribe: observer.subscribe,
        detect: detectCollisions
    };
};

ns.CollisionsDetector.events = {
    collisionDetected: 'collisionDetected'
};

}((typeof exports === 'undefined') ? window.Pong : exports));