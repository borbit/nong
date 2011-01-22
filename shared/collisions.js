(function(ns) {

var hasRequire = (typeof require !== 'undefined'),
    Observer = hasRequire ? require('./observer').Observer : ns.Observer;

ns.Collisions = function(stageRegion) {
    var balls = [];
    var shields = [];
    var observer = Observer();
    var events = ns.Collisions.events;

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