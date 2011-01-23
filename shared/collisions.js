(function(ns) {

var hasRequire = (typeof require !== 'undefined'),
    Observer = hasRequire ? require('./observer').Observer : ns.Observer;

<<<<<<< HEAD
ns.Collisions = function() {
    var observer = Observer();

    var dynamicElements = [];
    var staticElements = [];

    observer.register(ns.Collisions.events.collisionDetected);

    function addWall(wall) {
        staticElements.push(wall);
    }
=======
ns.Collisions = function(stageRegion) {
    var balls = [];
    var shields = [];
    var observer = Observer();
    var events = ns.Collisions.events;
>>>>>>> 14a4861baa64af29c7f5a25f028634e8f6dfb7fd

    function addBall(ball) {
        dynamicElements.push(ball);
    }

    function addShield(shield) {
        dynamicElements.push(shield);
    }

    function detectCollisions() {
<<<<<<< HEAD
        var targets = staticElements.concat(dynamicElements);
        while (targets.length > staticElements.length) { // we don't wan't to detect a collision of 2 static objects
            var target = targets.pop();
            for (var j = 0, targetsCount = targets.length; j < targetsCount; ++j) {
                if (target.collidesWith(targets[j])) {
                    observer.collisionDetected(target, targets[j]);
                }
=======
        for (var i = 0, ballsCount = balls.length; i < ballsCount; ++i) {
            detectCollisionsForBall(balls[i]);
        }
    }

    function detectCollisionsForBall(ball) {
        for (var i = 0, shieldsCount = shields.length; i < shieldsCount; ++i) {
            detectCollisionWithShield(ball, shields[i]);
        }

        detectCollisionWithStage(ball);
    }

    function detectCollisionWithStage(ball) {
        if (ball.region.right() > stageRegion.right()) {
            observer.fire(events.stage.rightEdge, ball);
        } else if (ball.region.left() < stageRegion.left()) {
            observer.fire(events.stage.leftEdge, ball);
        }

        if (ball.region.bottom() > stageRegion.bottom()) {
            observer.fire(events.stage.bottomEdge, ball);
        } else if (ball.region.top() < stageRegion.top()) {
            observer.fire(events.stage.topEdge, ball);
        }
    }

    function detectCollisionWithShield(ball, shield) {
        if (ball.region.right() > shield.region.left() && 
            ball.region.left() < shield.region.right() &&
            ball.region.bottom() > shield.region.top() && 
            ball.region.top() < shield.region.bottom()) {

            if(ball.region.right() > shield.region.right()) {
                observer.fire(events.shield.rightEdge, ball, shield);
            } else if (ball.region.left() < shield.region.left()) {
                observer.fire(events.shield.leftEdge, ball, shield);
>>>>>>> 14a4861baa64af29c7f5a25f028634e8f6dfb7fd
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