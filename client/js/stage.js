Pong.Stage = function(area, gameLoop, renderLoop) {
    var balls = [];
    var shields = [];
    var lastElementId = 0;

    function addShield(shield) {
        addElement(shield);
        shields.push(shield);
    }

    function addBall(ball) {

        ball.subscribe(Pong.Element.events.changed, function() {

            var ballLeft = ball.area.x,
                ballTop = ball.area.y,
                ballRight = ball.area.x + ball.area.width,
                ballBottom = ball.area.y + ball.area.height;
            
            for(var i = 0, shield; i < shields.length; i++) {
                shield = shields[i];

                var shieldLeft = shield.area.x,
                    shieldTop = shield.area.y,
                    shieldRight = shield.area.x + shield.area.width,
                    shieldBottom = shield.area.y + shield.area.height;

                if (ballRight > shieldLeft && ballLeft < shieldRight &&
                    ballBottom > shieldTop && ballTop < shieldBottom) {

                    if(ballRight > shieldRight) {
                        ball.area.x = shieldRight;
                        ball.setVX(ball.getVX() * -1);
                    }

                    if(ballLeft < shieldLeft) {
                        ball.area.x = shieldLeft - ball.area.width;
                        ball.setVX(ball.getVX() * -1);
                    }
                }
            }

            if (ballRight > area.x + area.width) {
                ball.area.x = area.x + area.width - ball.area.width;
                ball.setVX(ball.getVX() * -1);
            }

            if (ballBottom > area.y + area.height) {
                ball.area.y = area.y + area.height - ball.area.height;
                ball.setVY(ball.getVY() * -1);
            }

            if (ballLeft < area.x) {
                ball.area.x = area.x;
                ball.setVX(ball.getVX() * -1);
            }

            if (ballTop < area.y) {
                ball.area.y = area.y;
                ball.setVY(ball.getVY() * -1);
            }
        });

        balls.push(ball);
        addElement(ball);
    }

    function addElement(element) {
        element.id = lastElementId++;
        element.subscribe(Pong.Element.events.changingStarted, function() {
            gameLoop.addElement(element);
            renderLoop.addElement(element);
        });
        element.subscribe(Pong.Element.events.changingFinished, function() {
            gameLoop.removeElement(element.id);
            renderLoop.removeElement(element.id);
        });

        if(element.active) {
            gameLoop.addElement(element);
            renderLoop.addElement(element);
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