(function(ns) {

var pong = require('./pong'),
    utils = require('./utils'),
    comps = require('./components');

ns.Stage = function Stage() {
    var base = comps.Stage();
    var shields = [];

    base.addShield = function(shield) {
        shields.push(shield);
        base.addDynamicElement(shield);
        return base;
    }

    base.onBallHitsGoal = function(ball, goal) {
        ball.moveHome();
        /*for (var key in shields) {
            shields[key].moveTo(300 - shields[key].region.height / 2);
            shields[key].stop();
        }*/
        ball.stop();
        base.observer.fire(Stage.events.goalHit, goal);
    }

    return base;
};

ns.Stage.events = {
    goalHit: 'goalHit'
};

}((typeof exports === 'undefined') ? window.Pong : exports));