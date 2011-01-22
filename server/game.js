var util = require('util');
var wsClient = require('./ws-client');
var constants = require('../shared/constants');
var packets = require('../shared/packets');

exports.createGame = function() {
    var clients = [];
    
    var leftPlayer = null;
    var leftPlayerState = constants.PLAYER_STATE_FREE;
    
    var rightPlayer = null;
    var rightPlayerState = constants.PLAYER_STATE_FREE;
    
    var gameState = constants.GAME_STATE_WAITING_FOR_PLAYERS;
    
    
    function addClient(client) {
        clients.push(client);
        client.on(wsClient.events.PACKET, function(packet) {
            handlePacket(packet, client);
        });
        client.send(getGameStatePacket());
    }
    
    function removeClient(client) {
        // TODO
    }

    function joinLeft(client) {
        leftPlayer = client;
        leftPlayerState = constants.PLAYER_STATE_CONNECTED;
        broadcast(getGameStatePacket());
    };
    function joinRight(client) {
        rightPlayer = client;
        rightPlayerState = constants.PLAYER_STATE_CONNECTED;
        broadcast(getGameStatePacket());
    };
    function freeLeft() {
        leftPlayerState = constants.PLAYER_STATE_FREE;
        broadcast(getGameStatePacket());
    };
    function freeRight() {
        rightPlayerState = constants.PLAYER_STATE_FREE;
        broadcast(getGameStatePacket());
    };
    
    function handlePacket(packet, client) {
        switch (packet.id()) {
            case packets.JoinLeft.id:
                joinLeft(client);
                break;
                
            case packets.JoinRight.id:
                joinRight(client);
                break;
        }
    }
    
    function getGameStatePacket() {
        var gameStatePacket = packets.GameState();
        gameStatePacket.gameState(gameState);
        gameStatePacket.leftPlayerState(leftPlayerState);
        gameStatePacket.rightPlayerState(rightPlayerState);
        return gameStatePacket; 
    }
    
    function broadcast(packet) {
        clients.forEach(function(client) {
            client.send(packet);
        });
    }
        
    return {
        addClient: addClient,
        removeClient: removeClient,
        joinLeft: joinLeft,
        joinRight: joinRight,
        freeLeft: freeLeft,
        freeRight: freeRight
    };
};
