var assert = require('assert');
var should = require('should');
var Moves = require('../../shared/latency/moves').MovesBuffer;

var dummySize = 10;
var dummyElement = {
    serialize: function() { return {}; },
    unserialize: function() {},
    update: function() {}
};

function createMovesBuffer() {
    return new Moves(dummyElement, dummySize);
}

module.exports = {
    'test properties presence': function() {
        var moves = createMovesBuffer();

        moves.should.have.property('size');
        moves.should.have.property('buffer');
        moves.should.have.property('element');
    },

    'test methods presence': function() {
        var moves = createMovesBuffer();

        moves.add.should.be.a('function');
        moves.apply.should.be.a('function');
        moves.correct.should.be.a('function');
    },

    'test add method': function() {
        var moves = createMovesBuffer();
        var dummyInput = {up: true};

        moves.add(1, dummyInput);

        moves.buffer.should.have.length(1);
        moves.buffer[0].should.have.property('input');
        moves.buffer[0].should.have.property('state');
        moves.buffer[0].should.have.property('time');
    },

    'test max buffer size': function() {
        var expectedSize = 2;
        var moves = new Moves(dummyElement, expectedSize);

        var input4 = {variable4: 'value4'};
        var input5 = {variable5: 'value5'};
        moves.add(1, {variable1: 'value1'});
        moves.add(2, {variable2: 'value2'});
        moves.add(3, {variable3: 'value3'});
        moves.add(4, input4);
        moves.add(5, input5);

        moves.buffer.should.have.length(expectedSize);
        moves.buffer[0].input.should.eql(input4);
        moves.buffer[1].input.should.eql(input5);
        moves.buffer[0].number.should.eql(4);
        moves.buffer[1].number.should.eql(5);
    },

    'test apply method splices moves buffer': function() {
        var moves = createMovesBuffer();
        moves.add(1, {variable1: 'value1'});
        moves.add(2, {variable2: 'value2'});
        moves.add(3, {variable3: 'value3'});
        moves.add(4, {variable4: 'value4'});
        moves.add(5, {variable5: 'value5'});

        moves.apply(4, {variable1: 'value1'});

        moves.buffer.should.have.length(1);
    },

    'test apply method if actual state doesnt equal to exsiting': function() {
        dummyElement.state = {coordX: 0};
        dummyElement.serialize = function() {
            return {
                coordX: this.state.coordX
            };
        };
        dummyElement.unserialize = function(state) {
            this.state = state;
        };
        dummyElement.update = function(delay, input) {
            this.state.coordX++;
        };

        var moves = createMovesBuffer();

        moves.add(1); dummyElement.state.coordX++;
        moves.add(2); dummyElement.state.coordX++;
        moves.add(3); dummyElement.state.coordX++;
        moves.add(4); dummyElement.state.coordX++;
        moves.add(5);

        moves.apply(3, {coordX: 4});

        moves.buffer[0].state.coordX.should.eql(5);
        moves.buffer[1].state.coordX.should.eql(6);
        dummyElement.state.coordX.should.eql(6);
    }
};