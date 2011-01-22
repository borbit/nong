var Game = require('./game');
var Packets = require('../shared/packets');
var Client = require('./client');

exports.createHandlers = function(game) {
    var clients = [];
    
    game.on(Game.events.STATE_CHANGED, function() {
        broadcast(createGameStatePacket());
    });
    
    game.on(Game.events.ELEMENTS_CHANGED, function(elements) {
        broadcast(createGameSnapshotPacket(elements));
    });
    
    function handle(client) {
        clients.push(client);
        
        client.on(Client.events.DISCONNECTED, function() {
            removeClient(client);
        });

        client.on(Packets.JoinLeft.id, function() {
            game.joinLeftPlayer(client);
        });

        client.on(Packets.JoinRight.id, function() {
            game.joinRightPlayer(client);
        });

        client.send(createGameStatePacket());
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
    
    function createGameStatePacket() {
        var gameState = game.getState();
        var packet = Packets.GameState();
        packet.gameState(gameState.game);
        packet.leftPlayerState(gameState.leftPlayer);
        packet.rightPlayerState(gameState.rightPlayer);
        return packet;
    }
    
    function createGameSnapshotPacket(elements) {
        var packet = Packets.GameSnapshot();
        
        elements.forEach(function(element, index) {
            packet.addElementData(element.id, element.region);
        });
        
        return packet;
    }
    
    return {
        handle: handle
    };
}