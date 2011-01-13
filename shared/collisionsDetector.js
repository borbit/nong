(function(ns) {

var hasRequire = (typeof require !== 'undefined'),
    Observer = hasRequire ? require('observer') : ns.Observer;

ns.CollisionsDetector = function(stageRegion) {
    var observer = Observer();

    var stage = getAreaObject(stageRegion);
    var balls = [];
    var shields = [];

    observer.register(ns.CollisionsDetector.events.stage.leftEdge);
    observer.register(ns.CollisionsDetector.events.stage.topEdge);
    observer.register(ns.CollisionsDetector.events.stage.rightEdge);
    observer.register(ns.CollisionsDetector.events.stage.bottomEdge);

    observer.register(ns.CollisionsDetector.events.shield.leftEdge);
    observer.register(ns.CollisionsDetector.events.shield.rightEdge);

    function getAreaObject(regionObject) {
        return {
            left: regionObject.region.x,
            top: regionObject.region.y,
            right: regionObject.region.x + regionObject.region.width,
            bottom: regionObject.region.y + regionObject.region.height,
            _regionObject: regionObject
        };
    }

    function addBall(ball) {
        balls.push(ball);
    }

    function addShield(shield) {
        shields.push(shield);
    }

    function detectCollisions() {
        for (var i = 0, ballsCount = balls.length; i < ballsCount; ++i) {
            detectCollisionsForBall(getAreaObject(balls[i]));
        }
    }

    function detectCollisionsForBall(ball) {
        for (var i = 0, shieldsCount = shields.length; i < shieldsCount; ++i) {
            detectCollisionWithShield(ball, getAreaObject(shields[i]));
        }

        detectCollisionWithStage(ball);
    }

    function detectCollisionWithStage(ball) {
        if (ball.right > stage.right) {
            observer.stageRightEdgeHitted(ball._regionObject);
        } else if (ball.left < stage.left) {
            observer.stageLeftEdgeHitted(ball._regionObject);
        }

        if (ball.bottom > stage.bottom) {
            observer.stageBottomEdgeHitted(ball._regionObject);
        } else if (ball.top < stage.top) {
            observer.stageTopEdgeHitted(ball._regionObject);
        }
    }

    function detectCollisionWithShield(ball, shield) {
        if (ball.right > shield.left && ball.left < shield.right &&
            ball.bottom > shield.top && ball.top < shield.bottom) {

            if(ball.right > shield.right) {
                observer.shieldRightEdgeHitted({
                    ball: ball._regionObject,
                    shield: shield._regionObject
                });
            } else if (ball.left < shield.left) {
                observer.shieldLeftEdgeHitted({
                    ball: ball._regionObject,
                    shield: shield._regionObject
                });
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

ns.CollisionsDetector.events = {
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