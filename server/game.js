var util = require('util');
var constants = require('../shared/constants');

var leftPlayerState = constants.PLAYER_STATE_FREE;
var rightPlayerState = constants.PLAYER_STATE_FREE; 
var gameState = constants.GAME_STATE_WAITING_FOR_PLAYERS;

exports.joinLeft = function() {
    leftPlayerState = constants.PLAYER_STATE_CONNECTED;
};
exports.joinRight = function() {
    rightPlayerState = constants.PLAYER_STATE_CONNECTED;
};
exports.freeLeft = function() {
    leftPlayerState = constants.PLAYER_STATE_FREE;
};
exports.freeRight = function() {
    rightPlayerState = constants.PLAYER_STATE_FREE;
};

exports.getState = function() {
    return {
        game: gameState,
        leftPlayer: leftPlayerState,
        rightPlayer: rightPlayerState
    };
}
