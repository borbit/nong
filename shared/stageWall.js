(function(ns) {

var comts = require('./components'),
    utils = require('./utils');

function StageWall(x, y, length, orientation) {
    this.region = comts.Region({
        x: x, y: y,
        width: orientation == ns.StageWall.orientation.HORIZONTAL ? length : 50,
        height: orientation == ns.StageWall.orientation.VERTICAL ? length : 50
    });

    this.orientation = orientation;
}

utils.inherit(StageWall, comts.Element);

ns.StageWall = StageWall;

ns.StageWall.orientation = {
    'HORIZONTAL' : 'horizontal',
    'VERTICAL': 'vertical'
}

}((typeof exports === 'undefined') ? window.Pong : exports));