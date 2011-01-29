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
        var shieldLeft = new pong.Shield(40, 250);
        var shieldRight = new pong.Shield(750, 250);

        bindPlayerToShield(base.getPlayer('left'), shieldLeft);
        bindPlayerToShield(base.getPlayer('right'), shieldRight);

        stage.addDynamicElement(shieldLeft)
             .addDynamicElement(shieldRight)
             .addDynamicElement(new pong.Ball(100, 100))
             .start();
    }

    function bindPlayerToShield(player, shield) {
        player.subscribe(player.events.STOP, function() { shield.stop(); });
        player.subscribe(player.events.MOVEUP, function() { shield.moveUp(); });
        player.subscribe(player.events.MOVEDOWN, function() { shield.moveDown(); });
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
