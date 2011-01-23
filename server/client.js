var Packets = require('../shared/packets');
var Emitter = require('events').EventEmitter;

var events = exports.events = {
    PACKET: 'packet',
    DISCONNECTED: 'disconnected'
};

exports.createClient = function(connection) {
    var emitter = new Emitter();
    
    connection.addListener('message', function(message) {
        var packet = Packets.unserialize(message);
        emitter.emit(events.PACKET, packet);
        emitter.emit(packet.id(), packet);
    });
    
    connection.addListener('close', function() {
        emitter.emit(events.DISCONNECTED);
    });
    
    function send(packet) {
        var payload = Packets.serialize(packet);
        connection.send(payload);
    }
    
    function addEventsListener(event, callback) {
        emitter.on(event, callback);
    }
    
    return {
        send: send,
        on: addEventsListener
    };
};