(function(ns) {

var pong = require('./pong'),
    utils = require('./utils'),
    comps = require('./components');

ns.Stage = function Stage() {
    var base = comps.Stage();

    function addWall(x, y, length, orientation) {
        base.addStaticElement(new pong.StageWall(x, y, length, orientation));
    }

    addWall(-50, 0, 600, pong.StageWall.orientation.VERTICAL);
    addWall(800, 0, 600, pong.StageWall.orientation.VERTICAL);
    addWall(0, -50, 800, pong.StageWall.orientation.HORIZONTAL);
    addWall(0, 600, 800, pong.StageWall.orientation.HORIZONTAL);

    return base;
};

ns.Stage.events = {
    //changed: 'changed'
};

}((typeof exports === 'undefined') ? window.Pong : exports));