Pong.ClientWSAdapter = function() {
    var STATE_DISCONNECTED = 'disconnected';
    var STATE_CONNECTING = 'connecting';
    var STATE_CONNECTED = 'connected';

    var ws = null;
    var state = STATE_DISCONNECTED;
    var observer = Pong.Observer();

    observer.register(Pong.WSAdapter.events.CONNECTED);
    observer.register(Pong.WSAdapter.events.DISCONNECTED);
    observer.register(Pong.WSAdapter.events.MESSAGE);

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
        observer.message(JSON.parse(message.data));
    }

    function sendMessage(message) {
        ws.send(message);
    }

    return {
        connect: connect,
        disconnect: disconnect,
        sendMessage: sendMessage,
        subscribe: observer.subscribe
    };

};

Pong.WSAdapter = {};
Pong.WSAdapter.events = {
    DISCONNECTED: 'disconnected',
    CONNECTED: 'connected',
    MESSAGE: 'message'
};
