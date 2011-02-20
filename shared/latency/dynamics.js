(function(ns) {

var pong = require('../pong');
var _ = require('../utils')._;

ns.Dynamics = function() {
    this.timer = null;
    this.tick = 0;
    this.delay = 3;
    this.snapshots = [];
    this.elements = {};
    this.lastStepTime = 0;
};

ns.Dynamics.prototype.addElement = function(element) {
    this.elements[element.id] = element;
};

ns.Dynamics.prototype.pushSnapshot = function(snapshot) {
    this.snapshots.push(snapshot);
};

ns.Dynamics.prototype.applySnapshot = function(offset) {
    var snapshot = this.snapshots.shift();

    if(this.snapshots[0]) {
        console.log(this.snapshots[0]['ball'].x - snapshot['ball'].x);
    }

    var self = this;

    _.each(snapshot, function(elementState, elementId) {
        var element = self.elements[elementId];
        if(!_.isUndefined(element)) {
            element.setState(elementState);
            //element.updatePosition(offset);
        }
    });
};

ns.Dynamics.prototype.start = function() {
    this.started = true;
    this.step();
};

ns.Dynamics.prototype.stop = function() {
    this.started = false;
};

ns.Dynamics.prototype.step = function() {
    if(!this.started) {
        return;
    }

    var self = this;
    var delay = 1000 / pong.Globals.SPS;
    this.lastStepTime = (new Date()).getTime();

    setTimeout(function() {
        var delta = (new Date()).getTime() - self.lastStepTime;
        
        self.step();

        if(self.tick >= self.delay) {
            self.applySnapshot(delta - delay);
        }

        self.tick++;
    }, delay);
};

}((typeof exports === 'undefined') ? window.Latency : exports));