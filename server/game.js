var Constants = require('../shared/constants'),
    Ball = require('../shared/ball').Ball,
    Stage = require('../shared/stage').Stage,
    Shield = require('../shared/shield').Shield,
    Emitter = require('events').EventEmitter,
    Client = require('./client'),
    Player = require('./player');

var events = exports.events = {
    ELEMENTS_CHANGED: 'elementsChanged',
    STATE_CHANGED: 'stateChanged',
    GAME_STARTED: 'gameStarted'
};

exports.createGame = function() {
    var leftPlayer = null, rightPlayer = null,
        leftPlayerState = Constants.PLAYER_STATE_FREE,
        rightPlayerState = Constants.PLAYER_STATE_FREE,
        gameState = Constants.GAME_STATE_WAITING_FOR_PLAYERS,
        emitter = new Emitter(), stage;

    function joinLeftPlayer(client) {
        if (leftPlayerState != Constants.PLAYER_STATE_FREE) {
            return false;
        }
        
        client.on(Client.events.DISCONNECTED, freeLeftPlayer);
        leftPlayer = Player.createPlayer(client);
        leftPlayerState = Constants.PLAYER_STATE_CONNECTED;
        emitter.emit(events.STATE_CHANGED);
        
        if (leftPlayerState == Constants.PLAYER_STATE_CONNECTED && 
            rightPlayerState == Constants.PLAYER_STATE_CONNECTED) {
            start();
        }
    }
    
    function joinRightPlayer(client) {
        if (rightPlayerState != Constants.PLAYER_STATE_FREE) {
            return false;
        }
        
        client.on(Client.events.DISCONNECTED, freeRightPlayer);
        rightPlayer = Player.createPlayer(client);
        rightPlayerState = Constants.PLAYER_STATE_CONNECTED;
        emitter.emit(events.STATE_CHANGED);
        
        if (leftPlayerState == Constants.PLAYER_STATE_CONNECTED && 
            rightPlayerState == Constants.PLAYER_STATE_CONNECTED) {
            start();
        }
    }
    
    function freeLeftPlayer() {
        leftPlayer = null;
        leftPlayerState = Constants.PLAYER_STATE_FREE;
        gameState = Constants.GAME_STATE_WAITING_FOR_PLAYERS;
        emitter.emit(events.STATE_CHANGED);
        stage.stop();
    }
    
    function freeRightPlayer() {
        rightPlayer = null;
        rightPlayerState = Constants.PLAYER_STATE_FREE;
        gameState = Constants.GAME_STATE_WAITING_FOR_PLAYERS;
        emitter.emit(events.STATE_CHANGED);
        stage.stop();
    }
    
    function getState() {
        return {
            game: gameState,
            leftPlayer: leftPlayerState,
            rightPlayer: rightPlayerState
        };
    }
    
    function start() {
        var shieldLeft = Shield(40, 250);
        var shieldRight = Shield(750, 250);
        var ball = Ball(100, 100);

        stage = Stage();
        stage.addShield(shieldLeft, leftPlayer)
             .addShield(shieldRight, rightPlayer)
             .addBall(ball).start();
        
        stage.subscribe(Stage.events.changed, function(elements) {
            emitter.emit(events.ELEMENTS_CHANGED, elements);
        });
        
        gameState = Constants.GAME_STATE_IN_PROGRESS;
        emitter.emit(events.STATE_CHANGED);
        emitter.emit(events.GAME_STARTED);
    }
    
    function addEventsListener(event, callback) {
        emitter.on(event, callback);
    }
        
    return {
        on: addEventsListener,
        getState: getState,
        joinLeftPlayer: joinLeftPlayer,
        joinRightPlayer: joinRightPlayer
    };
};
