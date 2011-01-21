var game = require('./game');
var packets = require('../shared/packets');
var wsClient = require('./ws-client');
var clients = [];

var handlers = {
    'JoinRight': function(packet) {
        game.joinRight();
        broadcastGameState();
    },
    
    'JoinLeft': function(packet) {
        game.joinLeft();
        broadcastGameState();
    }
};

exports.handle = function(client) {
    addClient(client);
    
    client.on(wsClient.events.DISCONNECTED, function() {
        removeClient(client);
    });
    
    client.on(wsClient.events.PACKET, function(packet) {
        var packetName = packet.name();
        if(packetName in handlers) {
            handlers[packetName].call(null, packet)
        }
    });
    
    broadcastGameState();
};

function addClient(client) {
    clients.push(client);
}

function removeClient(client) {
    var index = clients.indexOf(client);
    if (index >= 0) {
        clients.splice(index, 1);
    }
}

function broadcast(packet) {
    clients.forEach(function(client) {
        client.send(packet);
    });
}

function broadcastGameState() {
    var gameState = game.getState();
    var gameStatePacket = packets.GameState();
    gameStatePacket.gameState(gameState.game);
    gameStatePacket.leftPlayerState(gameState.leftPlayer);
    gameStatePacket.rightPlayerState(gameState.rightPlayer);
    broadcast(gameStatePacket);
}