(function(ns) {

var pong = require('./pong'),
    utils = require('./utils'),
    comps = require('./components');

ns.Stage = function Stage(dynamics) {
    var base = comps.Stage(dynamics);
    var shields = [];

    base.addShield = function(shield) {
        shields.push(shield);
        base.addDynamicElement(shield);
        return base;
    }

    base.onBallHitsGoal = function(ball, goal) {
        /*for (var key in shields) {
            shields[key].moveTo(300 - shields[key].region.height / 2);
            shields[key].stop();
        }*/
        base.observer.fire(Stage.events.goalHit, goal);
    }

    return base;
};

ns.Stage.events = {
    goalHit: 'goalHit'
};

}((typeof exports === 'undefined') ? window.Pong : exports));