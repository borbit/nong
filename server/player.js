var Packets = require('../shared/packets');
var Client = require('./client');
var Emitter = require('events').EventEmitter;

var events = exports.events = {
    STOP: 'stop',
    MOVEUP: 'moveUp',
    MOVEDOWN: 'moveDown'
};
    
exports.createPlayer = function(client) {
    var emitter = new Emitter();
    
    client.on(Packets.ShieldMoveUp.id, function() {
        emitter.emit(events.MOVEUP);
    });
    
    client.on(Packets.ShieldMoveDown.id, function() {
        emitter.emit(events.MOVEDOWN);
    });
    
    client.on(Packets.ShieldStop.id, function() {
        emitter.emit(events.STOP);
    });
    
    function addEventListener(event, callback) {
        emitter.on(event, callback);
    }
    
    return {
        events: events,
        on: addEventListener,
        subscribe: addEventListener
    };
};
