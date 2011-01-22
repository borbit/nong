var packets = require('../shared/packets');
var Emitter = require('events').EventEmitter;

var events = exports.events = {
    PACKET: 'packet',
    DISCONNECTED: 'disconnected'
};

exports.createClient = function(connection) {
    var emitter = new Emitter();
    
    connection.addListener('message', function(message) {
        emitter.emit(events.PACKET, packets.unserialize(message));
    });
    
    connection.addListener('close', function() {
        emitter.emit(events.DISCONNECTED);
    });
    
    function send(packet) {
        var payload = packets.serialize(packet);
        connection.send(payload);
    }
    
    function addEventListener(event, callback) {
        emitter.on(event, callback);
    }
    
    return {
        send: send,
        on: addEventListener
    };
};
