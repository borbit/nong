(function(ns) {

var hasRequire = (typeof require !== 'undefined'),
    Observer = hasRequire ? require('observer') : ns.Observer;

ns.Collisions = function() {
    var observer = Observer();

    var dynamicElements = [];
    var staticElements = [];

    observer.register(ns.Collisions.events.collisionDetected);

    function addWall(wall) {
        staticElements.push(wall);
    }

    function addBall(ball) {
        dynamicElements.push(ball);
    }

    function addShield(shield) {
        dynamicElements.push(shield);
    }

    function detectCollisions() {
        var targets = staticElements.concat(dynamicElements);
        while (targets.length > staticElements.length) { // we don't wan't to detect a collision of 2 static objects
            var target = targets.pop();
            for (var j = 0, targetsCount = targets.length; j < targetsCount; ++j) {
                if (target.collidesWith(targets[j])) {
                    observer.collisionDetected(target, targets[j]);
                }
            }
        }
    }

    return {
        addWall: addWall,
        addBall: addBall,
        addShield: addShield,
        subscribe: observer.subscribe,
        detect: detectCollisions
    };
};

ns.Collisions.events = {
    collisionDetected: 'collisionDetected'
};

}((typeof exports === 'undefined') ? window.Pong : exports));