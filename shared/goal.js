(function(ns) {

var comts = require('./components'),
    utils = require('./utils');

function Goal(x, y, height) {
    this.region = comts.Region({
        x: x, y: y,
        width: 50,
        height: height
    });
}

utils.inherit(Goal, comts.Element);

ns.Goal = Goal;

}((typeof exports === 'undefined') ? window.Pong : exports));