(function(ns) {
var _ = require('../utils')._;

ns.MovesBuffer = function(element, size) {
    this.size = size;
    this.buffer = [];
    this.element = element;
};

_.extend(ns.MovesBuffer.prototype, {
    add: function(input) {
        var state = this.element.serialize();
        var time = (new Date()).getTime();

        this.buffer.push({
            input: input,
            state: state,
            time: time
        });

        if(this.buffer.length > this.size) {
            this.buffer.splice(0, 1);
        }
        
        return time;
    },

    apply: function(time, actlState) {
        this.buffer = _.select(this.buffer, function(move) {
            return move.time >= time;
        });

        var buffState = this.buffer[0].state;

        if(!_.isEqual(buffState, actlState)) {
            this.correct(actlState);
        }
    },

    correct: function(state) {
        this.element.unserialize(state);

        _.each(this.buffer, function(move) {

        });
    }
});

}((typeof exports === 'undefined') ? window.Latency : exports));