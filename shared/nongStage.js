(function(ns) {

var hasRequire = (typeof require !== 'undefined'),
    Stage = hasRequire ? require('./stage').Stage : ns.Stage,
    StageWall = hasRequire ? require('./stageWall').StageWall : ns.StageWall;

ns.NongStage = function NongStage() {
    var base = Stage();

    function addWall(x, y, length, orientation) {
        base.addStaticElement(new StageWall(x, y, length, orientation));
    }

    addWall(-50, 0, 600, StageWall.orientation.VERTICAL);
    addWall(800, 0, 600, StageWall.orientation.VERTICAL);
    addWall(0, -50, 800, StageWall.orientation.HORIZONTAL);
    addWall(0, 600, 800, StageWall.orientation.HORIZONTAL);

    return {
        stop: base.stop,
        start: base.start,
        addStaticElement: base.addStaticElement,
        addDynamicElement: base.addDynamicElement,
        subscribe: base.observer.subscribe
    };
};

ns.NongStage.events = {
    //changed: 'changed'
};

}((typeof exports === 'undefined') ? window.Pong : exports));