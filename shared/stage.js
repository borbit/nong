(function(ns) {

var hasRequire = (typeof require !== 'undefined'),
    StageWall = hasRequire ? require('stageWall') : ns.StageWall,
    GameLoop = hasRequire ? require('gameLoop') : ns.GameLoop,
    Collisions = hasRequire ? require('collisions') : ns.Collisions,
    Observer = hasRequire ? require('observer') : ns.Observer;

ns.Stage = function() {
    var balls = [];
    var shields = [];
    var gameLoop = GameLoop();
    var walls = {
        'left': new StageWall(-50, 0, 600, StageWall.orientation.VERTICAL),
        'right': new StageWall(800, 0, 600, StageWall.orientation.VERTICAL),
        'top': new StageWall(0, -50, 800, StageWall.orientation.HORIZONTAL),
        'bottom': new StageWall(0, 600, 800, StageWall.orientation.HORIZONTAL)
    };
    var observer = Observer();
    var collisions = Collisions();
    for (var key in walls) {
        collisions.addWall(walls[key]);
    }

    observer.register(ns.Stage.events.changed);
    subscribeForCollisionEvents();

    function addShield(shield, receiver) {
        var updater = ns.Updaters.Shield(shield);

        receiver.subscribe(receiver.events.moveUp, function() {
            shield.moveUp();
            gameLoop.addElement(shield.id);
        });

        receiver.subscribe(receiver.events.moveDown, function() {
            shield.moveDown();
            gameLoop.addElement(shield.id);
        });

        receiver.subscribe(receiver.events.stop, function() {
            shield.stop();
            gameLoop.removeElement(shield.id);
        });

        updater.subscribe(ns.Updaters.events.changed, function() {
            collisions.detect();
            observer.changed(shield);
        });

        gameLoop.addUpdater(updater);
        collisions.addShield(shield);
        shields.push(shield);
    }

    function addBall(ball, publisher) {
        var updater = Pong.Updaters.Ball(ball);

        updater.subscribe(ns.Updaters.events.changed, function() {
            collisions.detect();
            observer.changed(ball);
        });

        gameLoop.addUpdater(updater);
        gameLoop.addElement(ball.id);

        collisions.addBall(ball);
        balls.push(ball);
    }

    function subscribeForCollisionEvents() {
        collisions.subscribe(Collisions.events.collisionDetected, function(obj1, obj2) {
            obj1.hit(obj2);
            obj2.hit(obj1);
        });
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