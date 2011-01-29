var pong = require('../shared/pong'),
    comps = require('../shared/components'),
    utils = require('../shared/utils');

exports.createGame = function() {
    var stage = pong.NongStage();
    var base = comps.Game.createGame(stage);

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
        var leftPlayerState = comps.Constants.PLAYER_STATE_FREE;
        var rightPlayerState = comps.Constants.PLAYER_STATE_FREE;

        if(base.getPlayer('left')) {
            leftPlayerState = comps.Constants.PLAYER_STATE_CONNECTED;
        }

        if(base.getPlayer('right')) {
            rightPlayerState = comps.Constants.PLAYER_STATE_CONNECTED;
        }

        return {
            game: base.gameState,
            leftPlayer: leftPlayerState,
            rightPlayer: rightPlayerState
        };
    }

    function start() {
        stage.addDynamicElement(new pong.Shield(40, 250, base.getPlayer('left')))
             .addDynamicElement(new pong.Shield(750, 250, base.getPlayer('right')))
             .addDynamicElement(new pong.Ball(100, 100))
             .start();
    }

    function stop() {
        stage.stop();
    }

    return utils.Functions.extend(base, {
        start: start,
        stop: stop,
        getState: getState,
        joinLeftPlayer: joinLeftPlayer,
        joinRightPlayer: joinRightPlayer
    });
};
