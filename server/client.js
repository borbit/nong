var Packets = require('../shared/components/packets').Packets;
var Globals = require('../shared/globals').Globals;
var Emitter = require('events').EventEmitter;

var events = exports.events = {
    PACKET: 'packet',
    DISCONNECTED: 'disconnected'
};

exports.createClient = function(connection) {
    var emitter = new Emitter();
    
    connection.addListener('message', function(message) {
        setTimeout(function() {
            var packet = Packets.unserialize(message);
            emitter.emit(events.PACKET, packet);
            emitter.emit(packet.id(), packet.data());
        }, Globals.SIMULATED_LAG);
    });
    
    connection.addListener('close', function() {
        emitter.emit(events.DISCONNECTED);
    });
    
    function send(packet) {
        setTimeout(function() {
            var payload = Packets.serialize(packet);
            connection.send(payload);
        }, Globals.SIMULATED_LAG);
    }
    
    function addEventsListener(event, callback) {
        emitter.on(event, callback);
    }

    function fireEvent(event) {
        emitter.emit(event);
    }
    
    return {
        send: send,
        sendPacket: send,
        on: addEventsListener,
        subscribe: addEventsListener,
        fire: fireEvent
    };
};