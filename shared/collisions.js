(function(ns) {

var hasRequire = (typeof require !== 'undefined'),
    Observer = hasRequire ? require('observer').Observer : ns.Observer;

ns.Collisions = function(stageRegion) {
    var observer = Observer();

    var balls = [];
    var shields = [];

    observer.register(ns.Collisions.events.stage.leftEdge);
    observer.register(ns.Collisions.events.stage.topEdge);
    observer.register(ns.Collisions.events.stage.rightEdge);
    observer.register(ns.Collisions.events.stage.bottomEdge);

    observer.register(ns.Collisions.events.shield.leftEdge);
    observer.register(ns.Collisions.events.shield.rightEdge);

    function addBall(ball) {
        balls.push(ball);
    }

    function addShield(shield) {
        shields.push(shield);
    }

    function detectCollisions() {
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
            observer.stageRightEdgeHitted(ball);
        } else if (ball.region.left() < stageRegion.left()) {
            observer.stageLeftEdgeHitted(ball);
        }

        if (ball.region.bottom() > stageRegion.bottom()) {
            observer.stageBottomEdgeHitted(ball);
        } else if (ball.region.top() < stageRegion.top()) {
            observer.stageTopEdgeHitted(ball);
        }
    }

    function detectCollisionWithShield(ball, shield) {
        if (ball.region.right() > shield.region.left() && 
            ball.region.left() < shield.region.right() &&
            ball.region.bottom() > shield.region.top() && 
            ball.region.top() < shield.region.bottom()) {

            if(ball.region.right() > shield.region.right()) {
                observer.shieldRightEdgeHitted(ball, shield);
            } else if (ball.region.left() < shield.region.left()) {
                observer.shieldLeftEdgeHitted(ball, shield);
            }
        }
    }

    return {
        addBall: addBall,
        addShield: addShield,
        subscribe: observer.subscribe,
        detect: detectCollisions
    };
};

ns.Collisions.events = {
    stage: {
        leftEdge: 'stageLeftEdgeHitted',
        topEdge: 'stageTopEdgeHitted',
        rightEdge: 'stageRightEdgeHitted',
        bottomEdge: 'stageBottomEdgeHitted'
    },
    shield: {
        leftEdge: 'shieldLeftEdgeHitted',
        rightEdge: 'shieldRightEdgeHitted'
    }
};

}((typeof exports === 'undefined') ? window.Pong : exports));