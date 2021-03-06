(function(ns) {

var comts = require('./components'),
    utils = require('./utils');

function StageWall(x, y, length) {
    this.region = comts.Region({
        x: x, y: y,
        width: length,
        height: 50
    });
}

utils.inherit(StageWall, comts.Element);

ns.StageWall = StageWall;

}((typeof exports === 'undefined') ? window.Pong : exports));