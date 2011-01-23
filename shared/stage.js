(function(ns) {

var hasRequire = (typeof require !== 'undefined'),
<<<<<<< HEAD
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
=======
    Region = hasRequire ? require('./region').Region : ns.Region,
    GameLoop = hasRequire ? require('./gameLoop').GameLoop : ns.GameLoop,
    Observer = hasRequire ? require('./observer').Observer : ns.Observer,
    Collisions = hasRequire ? require('./collisions').Collisions : ns.Collisions,
    Updaters = hasRequire ? require('./updaters').Updaters : ns.Updaters;

ns.Stage = function Stage() {
    var balls = [], shields = [],
        region = Region({width: 800, height: 600}),
        gameLoop = GameLoop(),
        observer = Observer(),
        collisions = Collisions(region);

    subscribeForCollisionEvents();

    gameLoop.subscribe(GameLoop.events.tickWithUpdates, function(elements) {
        observer.fire(Stage.events.changed, elements);
        collisions.detect();
    });

    function addShield(shield, receiver) {
        var updater = Updaters.Shield(shield, region);

        receiver.subscribe(receiver.events.MOVEUP, function() {
            if(shield.region.y > region.y) {
                updater.moveUp();
                gameLoop.addElement(shield.id);
            }
        });

        receiver.subscribe(receiver.events.MOVEDOWN, function() {
            if(shield.region.y + shield.region.height < region.y + region.height) {
                updater.moveDown();
                gameLoop.addElement(shield.id);
            }
        });

        receiver.subscribe(receiver.events.STOP, function() {
            updater.stop();
            gameLoop.removeElement(shield.id);
        });

        updater.subscribe(Updaters.events.stopped, function() {
            updater.stop();
            gameLoop.removeElement(shield.id);
>>>>>>> 14a4861baa64af29c7f5a25f028634e8f6dfb7fd
        });

        gameLoop.addUpdater(updater);
        collisions.addShield(shield);
        shields.push(shield);
        return this;
    }

    function addBall(ball, publisher) {
<<<<<<< HEAD
        var updater = Pong.Updaters.Ball(ball);

        updater.subscribe(ns.Updaters.events.changed, function() {
            collisions.detect();
            observer.changed(ball);
        });
=======
        var updater = Updaters.Ball(ball);
>>>>>>> 14a4861baa64af29c7f5a25f028634e8f6dfb7fd

        gameLoop.addUpdater(updater);
        gameLoop.addElement(ball.id);

        collisions.addBall(ball);
        balls.push(ball);
        return this;
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