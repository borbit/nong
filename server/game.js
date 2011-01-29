var pong = require('../shared/pong'),
    comps = require('../shared/components'),
    utils = require('../shared/utils'),
    Player = require('./player');

var events = exports.events = comps.Game.events;
exports.createGame = function() {
    var stage = pong.NongStage();
    var base = comps.Game.createGame(stage);
    var activePlayers = {
        left: null,
        right: null
    };

    base.on(events.ELEMENTS_CHANGED, function(elements) {
        notifyElementsChanged(elements);
    });

    function joinPlayer(player) {
        base.joinPlayer(player);
        
        player.on(Player.events.JOINLEFT, function() {
            assignShield('left', player);
        });

        player.on(Player.events.JOINRIGHT, function() {
            assignShield('right', player);
        });

        player.updateGameState(getState());
    }

    function assignShield(side, player) {
        if (activePlayers[side]) {
            return;
        }

        activePlayers[side] = player;

        player.on(Player.events.GONE, function() {
            activePlayers[side] = null;
            updateGameState();
        });

        updateGameState();
    }

    // TODO: Anton, refucktor this please
    function updateGameState() {
        if (activePlayers.left && activePlayers.right) {
            base.gameState = comps.Constants.GAME_STATE_IN_PROGRESS;
            start();
        } else if (base.gameState == comps.Constants.GAME_STATE_IN_PROGRESS) {
            base.gameState = comps.Constants.GAME_STATE_WAITING_FOR_PLAYERS;
            stop();
        }

        for (var k in base.players) {
            base.players[k].updateGameState(getState());
        }
    }

    function notifyElementsChanged(elements) {
        for (var k in base.players) {
            base.players[k].updateElements(elements);
        }
    }

    function getState() {
        var leftPlayerState = comps.Constants.PLAYER_STATE_FREE;
        var rightPlayerState = comps.Constants.PLAYER_STATE_FREE;

        if (activePlayers.left) {
            leftPlayerState = comps.Constants.PLAYER_STATE_CONNECTED;
        }

        if (activePlayers.right) {
            rightPlayerState = comps.Constants.PLAYER_STATE_CONNECTED;
        }

        return {
            game: base.gameState,
            leftPlayer: leftPlayerState,
            rightPlayer: rightPlayerState
        };
    }

    function start() {
        var shieldLeft = new pong.Shield(40, 250, 'left');
        var shieldRight = new pong.Shield(750, 250, 'right');

        bindPlayerToShield(activePlayers.left, shieldLeft);
        bindPlayerToShield(activePlayers.right, shieldRight);

        stage.addDynamicElement(shieldLeft)
             .addDynamicElement(shieldRight)
             .addDynamicElement(new pong.Ball(100, 100, 'ball'))
             .start();
    }

    function bindPlayerToShield(player, shield) {
        player.subscribe(Player.events.STOP, function() { shield.stop(); });
        player.subscribe(Player.events.MOVEUP, function() { shield.moveUp(); });
        player.subscribe(Player.events.MOVEDOWN, function() { shield.moveDown(); });
    }

    function stop() {
        stage.stop();
    }

    return {
        start: start,
        stop: stop,
        on: base.on,
        getState: getState,
        joinPlayer: joinPlayer
    };
};
