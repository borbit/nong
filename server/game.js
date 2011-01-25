var Constants = require('../shared/constants'),
    Ball = require('../shared/ball').Ball,
    Stage = require('../shared/stage').Stage,
    Shield = require('../shared/shield').Shield,
    Emitter = require('events').EventEmitter,
    Client = require('./client'),
    Player = require('./player');

var events = exports.events = {
    LEFT_SHIELD_MOVEUP: 'shieldMoveUp',
    LEFT_SHIELD_MOVEDOWN: 'shieldMoveDown',
    LEFT_SHIELD_STOP: 'shieldMoveDown',
    RIGHT_SHIELD_MOVEUP: 'shieldMoveUp',
    RIGHT_SHIELD_MOVEDOWN: 'shieldMoveDown',
    RIGHT_SHIELD_STOP: 'shieldMoveDown',

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

        leftPlayer.subscribe(leftPlayer.events.MOVEUP, function() {
            emitter.emit(events.LEFT_SHIELD_MOVEUP);
        });

        leftPlayer.subscribe(leftPlayer.events.MOVEDOWN, function() {
            emitter.emit(events.LEFT_SHIELD_MOVEDOWN);
        });

        leftPlayer.subscribe(leftPlayer.events.STOP, function() {
            emitter.emit(events.LEFT_SHIELD_STOP);
        });
        
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

        rightPlayer.subscribe(rightPlayer.events.MOVEUP, function() {
            emitter.emit(events.RIGHT_SHIELD_MOVEUP);
        });

        rightPlayer.subscribe(rightPlayer.events.MOVEDOWN, function() {
            emitter.emit(events.RIGHT_SHIELD_MOVEDOWN);
        });

        rightPlayer.subscribe(rightPlayer.events.STOP, function() {
            emitter.emit(events.RIGHT_SHIELD_STOP);
        });
        
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
        var shieldLeft = new Shield(40, 250);
        var shieldRight = new Shield(750, 250);
        var ball = new Ball(100, 100);

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
