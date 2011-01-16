var util = require('util');
var constants = require('../shared/constants');
var packets = require('../shared/packets');

var clients = [];

var gameState           = constants.GAME_STATE_WAITING_FOR_PLAYERS;

var leftPlayer          = null;
var leftPlayerState     = constants.PLAYER_STATE_FREE;

var rightPlayer         = null;
var rightPlayerState    = constants.PLAYER_STATE_FREE; 

exports.join = function(client) {
    console.log('Client joined: ' + util.inspect(client));
    clients.push(client);
    client.setGame(this);
    
    var gameStatePacket = getGameStatePacket();
    client.send(gameStatePacket);
};

exports.left = function(client) {
    console.log('Client left: ' + util.inspect(client));
    
    var index = clients.indexOf(client);
    if (index == -1) {
        console.log('ERROR: Client is not in the list');
    }
    
    clients.splice(index, 1);
    client.setGame(null);
};

exports.joinLeft = function(client) {
    if (leftPlayer != null) {
        return;
    }
    
    leftPlayer = client;
    leftPlayerState = constants.PLAYER_STATE_CONNECTED;
    
    var gameStatePacket = getGameStatePacket();
    broadcast(gameStatePacket);
};

exports.joinRight = function(client) {
    if (rightPlayer != null) {
        return;
    }
    
    rightPlayer = client;
    rightPlayerState = constants.PLAYER_STATE_CONNECTED;
    
    var gameStatePacket = getGameStatePacket();
    broadcast(gameStatePacket);
};

function getGameStatePacket()
{
    var gameStatePacket = packets.GameState();
    gameStatePacket.setGameState(gameState);
    gameStatePacket.setLeftPlayerState(leftPlayerState);
    gameStatePacket.setRightPlayerState(rightPlayerState);
    return gameStatePacket;
}

function broadcast(packet) {
    clients.forEach(function(client) {
        client.send(packet);
    });
}
