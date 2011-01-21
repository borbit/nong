var packets = require('../shared/packets');
var Emitter = require('events').EventEmitter;

var events = exports.events = {
    PACKET: 'packet',
    DISCONNECTED: 'disconnected'
};

exports.createClient = function(connection) {
    var emitter = new Emitter();
    
    connection.addListener('message', function(message) {
        emitter.emit(events.PACKET, createPacket(JSON.parse(message)));
    });
    
    connection.addListener('close', function() {
        emitter.emit(events.DISCONNECTED);
    });
    
    function send(packet) {
        var payload = {
            name: packet.name(),
            data: packet.data()
        };
        connection.send(JSON.stringify(payload));
    }
    
    function addEventListener(event, callback) {
        emitter.on(event, callback);
    }
    
    return {
        send: send,
        on: addEventListener
    };
};

function createPacket(payload) {
    var packet = packets.factory(payload.name);
    
    if (!packet) {
        throw 'Unknown packet: ' + payload.name;
    }
    
    packet.data(payload.data);
    return packet;
}
