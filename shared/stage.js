(function(ns) {

var hasRequire = (typeof require !== 'undefined'),
    Region = hasRequire ? require('region') : ns.Region,
    Observer = hasRequire ? require('observer') : ns.Observer;

ns.Stage = function() {
    var balls = [], shields = [];
    var gameLoop = Pong.GameLoop();
    var region = Region({width: 800, height: 600});
    var observer = Observer();
    observer.register(ns.Stage.events.changed);

    function addShield(shield, publisher) {
        var updater = ns.Updaters.Shield(shield);

        publisher.subscribe(publisher.events.moveUp, function() {
            updater.moveUp();
            gameLoop.addElement(shield.id);
        });
        publisher.subscribe(publisher.events.moveDown, function() {
            updater.moveDown();
            gameLoop.addElement(shield.id);
        });
        publisher.subscribe(publisher.events.stop, function() {
            updater.stop();
            gameLoop.removeElement(shield.id);
        });
        updater.subscribe(ns.Updaters.events.changed, function() {
            observer.changed(shield);
        });

        gameLoop.addUpdater(updater);
        shields.push(shield);
    }

    function addBall(ball, publisher) {
        var updater = Pong.Updaters.Ball(ball)
        
        updater.subscribe(ns.Updaters.events.changed, function() {
            detectCollision(ball);
            observer.changed(ball);
        });

        gameLoop.addUpdater(updater);
        gameLoop.addElement(ball.id);
        balls.push(ball);
    }

    function calcCollisionOffset(ball, shield) {
        var ballCenter = parseInt(ball.region.y + ball.region.height / 2 - shield.region.y);
        var collOffset = parseInt(ballCenter / (shield.region.height / 100)) - 50;

        if(collOffset < 0) {
            collOffset *= -1;
        }
        return collOffset;
    }

    function detectCollision(ball) {
        var ballLeft = ball.region.x,
            ballTop = ball.region.y,
            ballRight = ball.region.x + ball.region.width,
            ballBottom = ball.region.y + ball.region.height;

        for(var i = 0, shield; i < shields.length; i++) {
            shield = shields[i];

            var shieldLeft = shield.region.x,
                shieldTop = shield.region.y,
                shieldRight = shield.region.x + shield.region.width,
                shieldBottom = shield.region.y + shield.region.height;

            if (ballRight > shieldLeft && ballLeft < shieldRight &&
                ballBottom > shieldTop && ballTop < shieldBottom) {

                var offset = calcCollisionOffset(ball, shield);
                ball.vy = ball.vy >= 0 ? offset/100 : offset/100*-1;

                if(ballRight > shieldRight) {
                    ball.region.x = shieldRight;
                    ball.vx = ball.vx * -1;
                }

                if (ballLeft < shieldLeft) {
                    ball.region.x = shieldLeft - ball.region.width;
                    ball.vx = ball.vx * -1;
                }
            }
        }

        if (ballRight > region.x + region.width) {
            ball.region.x = region.x + region.width - ball.region.width;
            ball.vx = ball.vx * -1;
        }

        if (ballBottom > region.y + region.height) {
            ball.region.y = region.y + region.height - ball.region.height;
            ball.vy = ball.vy * -1;
        }

        if (ballLeft < region.x) {
            ball.region.x = region.x;
            ball.vx = ball.vx * -1;
        }

        if (ballTop < region.y) {
            ball.region.y = region.y;
            ball.vy = ball.vy * -1;
        }
    }

    function start() {
        gameLoop.start();
    }

    function stop() {
        gameLoop.stop();
    }

    return {
        start: start,
        addBall: addBall,
        addShield: addShield,
        subscribe: observer.subscribe
    };
};

ns.Stage.events = {
    changed: 'changed'
};

}((typeof exports === 'undefined') ? window.Pong : exports));