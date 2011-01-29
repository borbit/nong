(function(ns) {

var pong = require('./pong'),
    comps = require('./components');

ns.NongStage = function NongStage() {
    var base = comps.Stage();

    function addWall(x, y, length, orientation) {
        base.addStaticElement(new pong.StageWall(x, y, length, orientation));
    }

    addWall(-50, 0, 600, pong.StageWall.orientation.VERTICAL);
    addWall(800, 0, 600, pong.StageWall.orientation.VERTICAL);
    addWall(0, -50, 800, pong.StageWall.orientation.HORIZONTAL);
    addWall(0, 600, 800, pong.StageWall.orientation.HORIZONTAL);

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