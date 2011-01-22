var util = require('util');
var constants = require('../shared/constants');
var Emitter = require('events').EventEmitter;

var events = exports.events = {
    STATE_CHANGED: 'stateChanged'
};

exports.createGame = function() {
    var leftPlayer = null;
    var rightPlayer = null;
    var leftPlayerState = constants.PLAYER_STATE_FREE;
    var rightPlayerState = constants.PLAYER_STATE_FREE;
    var emitter = new Emitter();

    function joinLeftPlayer(client) {
        if (leftPlayerState != constants.PLAYER_STATE_FREE) {
            return false;
        }
        
        leftPlayer = client;
        leftPlayerState = constants.PLAYER_STATE_CONNECTED;
        emitter.emit(events.STATE_CHANGED);
    }
    
    function joinRightPlayer(client) {
        if (rightPlayerState != constants.PLAYER_STATE_FREE) {
            return false;
        }
        
        rightPlayer = client;
        rightPlayerState = constants.PLAYER_STATE_CONNECTED;
        emitter.emit(events.STATE_CHANGED);
    }
    
    function freeLeftPlayer() {
        if (leftPlayerState == constants.PLAYER_STATE_FREE) {
            return false;
        }
        
        leftPlayer = null;
        leftPlayerState = constants.PLAYER_STATE_FREE;
        emitter.emit(events.STATE_CHANGED);
    }
    
    function freeRightPlayer() {
        if (rightPlayerState == constants.PLAYER_STATE_FREE) {
            return false;
        }
        
        rightPlayer = null;
        rightPlayerState = constants.PLAYER_STATE_FREE;
        emitter.emit(events.STATE_CHANGED);
    }
    
    function getState() {
        var gameState = constants.GAME_STATE_WAITING_FOR_PLAYERS;
        
        if (leftPlayerState == constants.PLAYER_STATE_CONNECTED && 
            rightPlayerState == constants.PLAYER_STATE_CONNECTED) {
            gameState = constants.GAME_STATE_IN_PROGRESS;
        }
        
        return {
            game: gameState,
            leftPlayer: leftPlayerState,
            rightPlayer: rightPlayerState
        };
    }
    
    function addEventsListener(event, callback) {
        emitter.on(event, callback);
    }
        
    return {
        on: addEventsListener,
        getState: getState,
        joinLeftPlayer: joinLeftPlayer,
        joinRightPlayer: joinRightPlayer,
        freeLeftPlayer: freeLeftPlayer,
        freeRightPlayer: freeRightPlayer
    };
};
