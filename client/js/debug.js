$(function() {
    $('#connect').bind('click', connect);
    $('#disconnect').bind('click', disconnect);
    $('#join-left').bind('click', joinLeft);
    $('#join-right').bind('click', joinRight);
    
    console.log('Initialization complete');
});

var ws = null;

var STATE_DISCONNECTED  = 'disconnected';
var STATE_CONNECTING    = 'connecting';
var STATE_CONNECTED     = 'connected';

var state = STATE_DISCONNECTED;

function connect() {
    if (state != STATE_DISCONNECTED) {
        console.log('ERROR: Wrong connection state: ' + state);
        return;
    }
    
    console.log('Connecting...');
    
    ws = new WebSocket('ws://pong.dev:8080/');
    state = STATE_CONNECTING;
    _connecting();
    
    ws.onopen = function() {
        console.log('WebSocket connected');
        state = STATE_CONNECTED;
        _connected();
    };
    ws.onmessage = function(message) {
        console.log('Received: ' + message.data);
        _processMessage(message);
    };
    ws.onerror = function(error) {
        console.log('WebSocket error: ' + error);
        state = STATE_DISCONNECTED;
        _disconnected();
    };
    ws.onclose = function() {
        console.log('WebSocket disconnected');
        state = STATE_DISCONNECTED;
        _disconnected();
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

function _connecting() {
    $('#connect').attr('disabled', 'disabled');
}

function _connected() {
    $('#connect').attr('disabled', 'disabled');
    $('#disconnect').removeAttr('disabled');
}

function _disconnected() {
    $('#connect').removeAttr('disabled');
    $('#disconnect').attr('disabled', 'disabled');
    $('#join-left').attr('disabled', 'disabled');
    $('#join-right').attr('disabled', 'disabled');
}

function joinLeft() {
    var packet = Pong.Packets.JoinLeft();
    _sendPacket(packet);
}

function joinRight() {
    var packet = Pong.Packets.JoinRight();
    _sendPacket(packet);
}

function _processMessage(message) {
    var payload = JSON.parse(message.data);
    var packet = _createPacket(payload);
    var packetName = packet.getName();
    console.log('Received packet: ' + packetName);
    switch (packetName) {
        case 'GameState':
            _processGameState(packet);
            break;
        
        default:
            throw 'Unknown packet: ' + packetName;
    }
}

function _processGameState(packet) {
    var gameState = packet.getGameState();
    if (gameState == Pong.Constants.GAME_STATE_WAITING_FOR_PLAYERS) {
        var leftPlayerState = packet.getLeftPlayerState();
        if (leftPlayerState == Pong.Constants.PLAYER_STATE_FREE) {
            $('#join-left').removeAttr('disabled');
        } else {
            $('#join-left').attr('disabled', 'disabled');
        }
        
        var rightPlayerState = packet.getRightPlayerState();
        if (rightPlayerState == Pong.Constants.PLAYER_STATE_FREE) {
            $('#join-right').removeAttr('disabled');
        } else {
            $('#join-right').attr('disabled', 'disabled');
        }
    }
}

function _createPacket(payload) {
    var name = payload.name;
    if (typeof Pong.Packets[name] === 'undefined') {
        throw 'Unknown packet: ' + name;
    }
    
    var packet = new Pong.Packets[name];
    packet.setData(payload.data);
    return packet;
}

function _sendPacket(packet) {
    var payload = {
        name: packet.getName(),
        data: packet.getData()
    };
    var jsonPayload = JSON.stringify(payload);
    console.log('Sending packet: ' + jsonPayload);
    ws.send(jsonPayload);
}