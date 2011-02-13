(function(ns) {
var _ = require('../utils')._;

ns.MovesBuffer = function(element, size) {
    this.size = size;
    this.buffer = [];
    this.element = element;
};

ns.MovesBuffer.prototype.add = function(number, input) {
    var state = this.element.serialize();
    var time = (new Date()).getTime();
    var data = {
        number: number,
        state: state,
        time: time
    };

    if (!_.isUndefined(input)) {
        data.input = input;
    }

    this.buffer.push(data);

    if(this.buffer.length > this.size) {
        this.buffer.splice(0, 1);
    }
};

ns.MovesBuffer.prototype.apply = function(number, actlState) {
    this.buffer = _.select(this.buffer, function(move) {
        return move.number >= number;
    });

    var buffState = this.buffer[0].state;

    if(!_.isEqual(buffState, actlState)) {
        this.correct(actlState);
    }
};

ns.MovesBuffer.prototype.correct = function(state) {
    this.element.unserialize(state);
    this.buffer.splice(0, 1);

    var prevTime = state.time;
    var self = this;
    
    this.buffer = _.map(this.buffer, function(move) {
        self.element.update(prevTime - move.time, move.input);
        move.state = self.element.serialize();
        return move;
    });
};

}((typeof exports === 'undefined') ? window.Latency : exports));