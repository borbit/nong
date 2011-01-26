var Constants = require('../shared/constants'),
    NongStage = require('../shared/nongStage').NongStage,
    Emitter = require('events').EventEmitter,
    Stage = require('../shared/stage').Stage,
    Shield = require('../shared/shield').Shield,
    Ball = require('../shared/ball').Ball,
    Player = require('./player'),
    Game = require('./game');

exports.createGame = function() {
    var stage = NongStage();
    var base = Game.createGame(stage);

    function joinLeftPlayer(player) {
        if (!base.getPlayer('left')) {
            base.joinPlayer('left', player);
        }
    }

    function joinRightPlayer(player) {
        if (!base.getPlayer('right')) {
            base.joinPlayer('right', player);
        }
    }

    function getState() {
        var leftPlayerState = Constants.PLAYER_STATE_FREE;
        var rightPlayerState = Constants.PLAYER_STATE_FREE;

        if(base.getPlayer('left')) {
            leftPlayerState = Constants.PLAYER_STATE_CONNECTED;
        }

        if(base.getPlayer('right')) {
            rightPlayerState = Constants.PLAYER_STATE_CONNECTED;
        }

        return {
            game: base.gameState,
            leftPlayer: leftPlayerState,
            rightPlayer: rightPlayerState
        };
    }

    function start() {
        stage.addDynamicElement(new Shield(40, 250, base.getPlayer('left')))
             .addDynamicElement(new Shield(750, 250, base.getPlayer('right')))
             .addDynamicElement(new Ball(100, 100))
             .start();
    }

    function stop() {
        stage.stop();
    }

    function addEventsListener(event, callback) {
        base.emitter.on(event, callback);
    }

    return {
        on: addEventsListener,
        getState: getState,
        joinLeftPlayer: joinLeftPlayer,
        joinRightPlayer: joinRightPlayer
    };
};
