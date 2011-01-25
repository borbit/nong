(function(ns) {

var hasRequire = (typeof require !== 'undefined'),
    StageWall = hasRequire ? require('./stageWall').StageWall : ns.StageWall,
    GameLoop = hasRequire ? require('./gameLoop').GameLoop : ns.GameLoop,
    CollisionsDetector = hasRequire ? require('./collisionsDetector').CollisionsDetector : ns.CollisionsDetector,
    Updaters = hasRequire ? require('./updaters').Updaters : ns.Updaters,
    Observer = hasRequire ? require('./observer').Observer : ns.Observer;

ns.Stage = function Stage() {
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
    var collisionsDetector = CollisionsDetector();
    for (var key in walls) {
        collisionsDetector.addStaticElement(walls[key]);
    }

    gameLoop.subscribe(GameLoop.events.tickWithUpdates, function(elements) {
        observer.fire(Stage.events.changed, elements);
    });

    subscribeForCollisionEvents();

    function addShield(shield, receiver) {
        var updater = Updaters.Shield(shield);

        receiver.subscribe(receiver.events.MOVEUP, function() {
            shield.moveUp();
            gameLoop.addElement(shield.id);
        });

        receiver.subscribe(receiver.events.MOVEDOWN, function() {
            shield.moveDown();
            gameLoop.addElement(shield.id);
        });

        receiver.subscribe(receiver.events.STOP, function() {
            shield.stop();
            gameLoop.removeElement(shield.id);
        });

        updater.subscribe(Updaters.events.changed, function() {
            collisionsDetector.detect();
        });

        gameLoop.addUpdater(updater);
        collisionsDetector.addDynamicElement(shield);
        shields.push(shield);
        return this;
    }

    function addBall(ball, publisher) {
        var updater = Updaters.Ball(ball);

        updater.subscribe(Updaters.events.changed, function() {
            collisionsDetector.detect();
        });

        gameLoop.addUpdater(updater);
        gameLoop.addElement(ball.id);

        collisionsDetector.addDynamicElement(ball);
        balls.push(ball);
        return this;
    }

    function subscribeForCollisionEvents() {
        collisionsDetector.subscribe(CollisionsDetector.events.collisionDetected, function(obj1, obj2) {
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
        stop: stop,
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