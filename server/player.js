var pong = require('../shared/pong'),
    utils = require('../shared/utils'),
    Emitter = require('events').EventEmitter,
    Client = require('./client');

var events = exports.events = {
    GONE: 'gone',
    STOP: 'stop',
    MOVEUP: 'moveUp',
    MOVEDOWN: 'moveDown'
};
    
exports.createPlayer = function(client) {
    var emitter = new Emitter();
    var score = 0;
    
    client.on(Client.events.DISCONNECTED, function() {
        emitter.emit(events.GONE);
    });

    client.on(pong.Packets.ShieldMoveUp.id, function() {
        emitter.emit(events.MOVEUP);
    });
    
    client.on(pong.Packets.ShieldMoveDown.id, function() {
        emitter.emit(events.MOVEDOWN);
    });
    
    client.on(pong.Packets.ShieldStop.id, function() {
        emitter.emit(events.STOP);
    });

    function on(event, callback) {
        emitter.on(event, callback);
    }

    return {
        on: on,
        subscribe: on,
        events: events,
        get score() { return score; }
    };
};
