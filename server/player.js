var pong = require('../shared/pong'),
    utils = require('../shared/utils'),
    Emitter = require('events').EventEmitter,
    Client = require('./client');

var events = exports.events = {
    STOP: 'stop',
    MOVEUP: 'moveUp',
    MOVEDOWN: 'moveDown'
};
    
exports.createPlayer = function(client) {
    client.on(pong.Packets.ShieldMoveUp.id, function() {
        client.fire(events.MOVEUP);
    });
    
    client.on(pong.Packets.ShieldMoveDown.id, function() {
        client.fire(events.MOVEDOWN);
    });
    
    client.on(pong.Packets.ShieldStop.id, function() {
        client.fire(events.STOP);
    });

    return utils.Functions.extend(client, {
        events: events
    });
};
