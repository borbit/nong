var Packets = require('../shared/components/packets').Packets;

Pong.Transports.WS = function() {
    var STATE_DISCONNECTED = 'disconnected';
    var STATE_CONNECTING = 'connecting';
    var STATE_CONNECTED = 'connected';

    var ws = null;
    var state = STATE_DISCONNECTED;
    var observer = Utils.Observer();

    function connect() {
        ws = new WebSocket(Pong.Config.WS_BACKEND);
        
        ws.onopen = function() {
            console.log('WebSocket connected');
            state = STATE_CONNECTED;
            observer.fire(Pong.WSAdapter.events.CONNECTED);
        };
        ws.onmessage = function(message) {
            //console.log('Received: ' + message.data);
            processMessage(message);
        };
        ws.onerror = function(error) {
            console.log('WebSocket error: ' + error);
            state = STATE_DISCONNECTED;
            observer.fire(Pong.WSAdapter.events.DISCONNECTED);
        };
        ws.onclose = function() {
            console.log('WebSocket disconnected');
            state = STATE_DISCONNECTED;
            observer.fire(Pong.WSAdapter.events.DISCONNECTED);
        };

        state = STATE_CONNECTING
    }

    function disconnect() {
        if (state != STATE_CONNECTED) {
            console.log('ERROR: Wrong connection state: ' + state);
            return;
        }
        
        console.log('Disconnecting...');
        ws.close();
    }

    function processMessage(message) {
        var packet = Components.Packets.unserialize(message.data);
        observer.fire(packet.id(), packet.data());
    }

    function sendMessage(message) {
        ws.send(message);
    }

    function sendPacket(packet) {
        ws.send(Components.Packets.serialize(packet));
    }

    return {
        connect: connect,
        disconnect: disconnect,
        sendMessage: sendMessage,
        subscribe: observer.subscribe,
        on: observer.subscribe
    };

};

Pong.WSAdapter = {};
Pong.WSAdapter.events = {
    DISCONNECTED: 'disconnected',
    CONNECTED: 'connected',
    PACKET: 'packet'
};
