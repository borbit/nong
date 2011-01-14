(function(ns) {

var hasRequire = (typeof require !== 'undefined'),
    Region = hasRequire ? require('region') : ns.Region,
    GameLoop = hasRequire ? require('gameLoop') : ns.GameLoop,
    CollisionsDetector = hasRequire ? require('collisionsDetector') : ns.CollisionsDetector,
    Observer = hasRequire ? require('observer') : ns.Observer;

ns.Stage = function() {
    var balls = [];
    var shields = [];

    var gameLoop = GameLoop();
    var region = Region({width: 800, height: 600});
    var observer = Observer();
    var collisions = CollisionsDetector({region: region});

    observer.register(ns.Stage.events.changed);
    subscribeForCollisionEvents();

    gameLoop.subscribe(GameLoop.events.tickWithUpdates, function() {
        collisions.detect();
    });

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
        collisions.addShield(shield);
        shields.push(shield);
    }

    function addBall(ball, publisher) {
        var updater = Pong.Updaters.Ball(ball);

        updater.subscribe(ns.Updaters.events.changed, function() {
            observer.changed(ball);
        });

        gameLoop.addUpdater(updater);
        gameLoop.addElement(ball.id);

        collisions.addBall(ball);
        balls.push(ball);
    }

    function subscribeForCollisionEvents() {
        collisions.subscribe(CollisionsDetector.events.stage.leftEdge, function(ball) {
            ball.region.x = region.x;
            ball.vx = ball.vx * -1;
        });

        collisions.subscribe(CollisionsDetector.events.stage.topEdge, function(ball) {
            ball.region.y = region.y;
            ball.vy = ball.vy * -1;
        });

        collisions.subscribe(CollisionsDetector.events.stage.rightEdge, function(ball) {
            ball.region.x = region.x + region.width - ball.region.width;
            ball.vx = ball.vx * -1;
        });

        collisions.subscribe(CollisionsDetector.events.stage.bottomEdge, function(ball) {
            ball.region.y = region.y + region.height - ball.region.height;
            ball.vy = ball.vy * -1;
        });

        collisions.subscribe(CollisionsDetector.events.shield.leftEdge, function(ball, shield) {
            var offset = calcCollisionOffset(ball, shield);
            ball.region.x = shield.region.x - ball.region.width;
            ball.vy = ball.vy >= 0 ? offset / 100 : offset / 100 * -1;
            ball.vx = ball.vx * -1;
        });

        collisions.subscribe(CollisionsDetector.events.shield.rightEdge, function(ball, shield) {
            var offset = calcCollisionOffset(ball, shield);
            ball.region.x = shield.region.x + shield.region.width;
            ball.vy = ball.vy >= 0 ? offset / 100 : offset / 100 * -1;
            ball.vx = ball.vx * -1;
        });
    }

    function calcCollisionOffset(ball, shield) {
        var ballCenter = parseInt(ball.region.y + ball.region.height / 2 - shield.region.y, 10);
        var collOffset = parseInt(ballCenter / (shield.region.height / 100), 10) - 50;

        if(collOffset < 0) {
            collOffset *= -1;
        }

        return collOffset;
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