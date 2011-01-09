Pong.Stage = function(gameLoop, renderLoop) {

    var region = Pong.Region({width: 800, height: 600});
    var balls = [];
    var shields = [];

    function addShield(shield) {
        addElement(shield);
        shields.push(shield);
        return this;
    }

    function addBall(ball) {

        ball.subscribe(Pong.Element.events.changed, function() {

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

                    if(ballRight > shieldRight) {
                        ball.region.x = shieldRight;
                        ball.vx = ball.vx * -1;
                    }

                    if(ballLeft < shieldLeft) {
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
        });

        balls.push(ball);
        addElement(ball);
        return this;
    }

    function addElement(element) {
        element.subscribe(Pong.Element.events.changingStarted, function() {
            gameLoop.addElement(element);
            renderLoop.addElement(element.id);
        });
        element.subscribe(Pong.Element.events.changingFinished, function() {
            gameLoop.removeElement(element.id);
            renderLoop.removeElement(element.id);
        });

        if(element.active) {
            gameLoop.addElement(element);
            renderLoop.addElement(element.id);
        }
    }

    function start() {
        gameLoop.start();
        renderLoop.start();
    }

    function stop() {
        gameLoop.stop();
        renderLoop.stop();
    }

    return {
        start: start,
        addBall: addBall,
        addShield: addShield
    };
};