Pong.ClientWSAdapter = function() {
    
    var STATE_DISCONNECTED = 'disconnected';
    var STATE_CONNECTING = 'connecting';
    var STATE_CONNECTED = 'connected';

    var ws = null;
    var state = STATE_CONNECTING;
    var observer = Pong.Observer();

    observer.register(Pong.WSAdapter.events.CONNECTED);
    observer.register(Pong.WSAdapter.events.DISCONNECTED);
    observer.register(Pong.WSAdapter.events.GAMESTATE);

    function connect() {
        ws = new WebSocket(Pong.Config.WS_BACKEND);
        
        ws.onopen = function() {
            console.log('WebSocket connected');
            state = STATE_CONNECTED;
            observer.connected();
        };
        ws.onmessage = function(message) {
            console.log('Received: ' + message.data);
            processMessage(message);
        };
        ws.onerror = function(error) {
            console.log('WebSocket error: ' + error);
            state = STATE_DISCONNECTED;
            observer.disconnected();
        };
        ws.onclose = function() {
            console.log('WebSocket disconnected');
            state = STATE_DISCONNECTED;
            observer.disconnected();
        };
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
        var payload = JSON.parse(message.data);
        var packet = createPacket(payload);
        
        if(observer.isRegistered(packet.name())) {
            observer.fire(packet.name(), [packet]);
        }
    }

    function createPacket(payload) {
        var PacketClass = Pong.Packets[payload.name];

        if(PacketClass == null) {
            throw 'Unknown packet: ' + payload.name;
        }
        
        var packet = PacketClass();
        packet.data(payload.data);
        return packet;
     }

     function sendPacket(packet) {
        var payload = JSON.stringify({
            name: packet.name(),
            data: packet.data()
        });
        console.log('Sending packet: ' + payload);
        ws.send(payload);
    }

    return {
        connect: connect,
        disconnect: disconnect,
        sendPacket: sendPacket,
        subscribe: observer.subscribe
    };

};

Pong.WSAdapter = {};
Pong.WSAdapter.events = {
    DISCONNECTED: 'disconnected',
    CONNECTED: 'connected',
    GAMESTATE: 'GameState'
};