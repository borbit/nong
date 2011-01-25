(function(ns) {

var hasRequire = (typeof require !== 'undefined'),
    Stage = hasRequire ? require('./stage').Stage : ns.Stage,
    StageWall = hasRequire ? require('./stageWall').StageWall : ns.StageWall,
    Updaters = hasRequire ? require('./updaters').Updaters : ns.Updaters;

ns.NongStage = function NongStage() {
    var base = Stage();
    var balls = [], shields = [];

    base.collisions.addWall(new StageWall(-50, 0, 600, StageWall.orientation.VERTICAL));
    base.collisions.addWall(new StageWall(800, 0, 600, StageWall.orientation.VERTICAL));
    base.collisions.addWall(new StageWall(0, -50, 800, StageWall.orientation.HORIZONTAL));
    base.collisions.addWall(new StageWall(0, 600, 800, StageWall.orientation.HORIZONTAL));

    function addShield(shield, receiver) {
        var updater = Updaters.Shield(shield);

        receiver.subscribe(receiver.events.MOVEUP, function() {
            shield.moveUp();
            base.gameLoop.addElement(shield.id);
        });

        receiver.subscribe(receiver.events.MOVEDOWN, function() {
            shield.moveDown();
            base.gameLoop.addElement(shield.id);
        });

        receiver.subscribe(receiver.events.STOP, function() {
            shield.stop();
            base.gameLoop.removeElement(shield.id);
        });

        updater.subscribe(Updaters.events.changed, function() {
            base.collisions.detect();
        });

        base.gameLoop.addUpdater(updater);
        base.collisions.addShield(shield);
        shields.push(shield);
        return this;
    }

    function addBall(ball, publisher) {
        var updater = Updaters.Ball(ball);

        updater.subscribe(Updaters.events.changed, function() {
            base.collisions.detect();
        });

        base.gameLoop.addUpdater(updater);
        base.gameLoop.addElement(ball.id);

        base.collisions.addBall(ball);
        balls.push(ball);
        return this;
    }

    return {
        stop: base.stop,
        start: base.start,
        addBall: addBall,
        addShield: addShield,
        subscribe: base.observer.subscribe
    };
};

ns.NongStage.events = {
    //changed: 'changed'
};

}((typeof exports === 'undefined') ? window.Pong : exports));