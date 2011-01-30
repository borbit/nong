var pong = require('../shared/pong'),
    comps = require('../shared/components'),
    utils = require('../shared/utils'),
    Player = require('./player');

exports.createGame = function() {
    var spectators = {};
    var players = {left: null, right: null};
    var gameState = comps.Constants.GAME_STATE_WAITING_FOR_PLAYERS;

    var stage = pong.Stage();
    var ball = new pong.Ball(100, 100, 'ball');
    var shields = {
        left: new pong.Shield(40, 250, 'left'),
        right: new pong.Shield(750, 250, 'right')
    };

    stage.subscribe(comps.Stage.events.changed, function(elements) {
        notifyElementsChanged(elements);
    });

    function joinPlayer(player) {
        var id = player.id;

        if (!utils._.isUndefined(spectators[id])) {
            throw 'Tring to connect already connected player: ' + id;
        }

        spectators[id] = player;

        player.on(Player.events.GONE, function() {
            freePlayer(id);
        });

        player.on(Player.events.JOINLEFT, function() {
            assignShield('left', player);
        });
        player.on(Player.events.JOINRIGHT, function() {
            assignShield('right', player);
        });

        player.updateGameState(getState());
    }

    function freePlayer(id) {
        if (utils._.isUndefined(spectators[id])) {
            throw 'Tring to free not connected player: ' + id;
        }

        delete spectators[id];
    }

    function assignShield(side, player) {
        if (players[side]) {
            return;
        }

        players[side] = player;

        player.on(Player.events.GONE, function() {
            players[side] = null;
            updateGameState();
        });

        player.on(Player.events.MOVEUP, function() {
            notifyShieldMoveUp(side, shields[side].region.x, shields[side].region.y);
        });
        player.on(Player.events.MOVEDOWN, function() {
            notifyShieldMoveDown(side, shields[side].region.x, shields[side].region.y);
        });
        player.on(Player.events.STOP, function() {
            notifyShieldStop(side, shields[side].region.x, shields[side].region.y);
        });

        updateGameState();
    }

    function updateGameState() {
        if (players.left && players.right) {
            gameState = comps.Constants.GAME_STATE_IN_PROGRESS;
            start();
        } else if (gameState == comps.Constants.GAME_STATE_IN_PROGRESS) {
            gameState = comps.Constants.GAME_STATE_WAITING_FOR_PLAYERS;
            stop();
        }

        for (var i in spectators) {
            spectators[i].updateGameState(getState());
        }
    }

    function notifyElementsChanged(elements) {
        for (var i in spectators) {
            spectators[i].updateElements(elements);
        }
    }

    function notifyShieldMoveUp(side, x, y) {
        for (var i in spectators) {
            spectators[i].shieldMoveUp(side, x, y);
        }
    }

    function notifyShieldMoveDown(side, x, y) {
        for (var i in spectators) {
            spectators[i].shieldMoveDown(side, x, y);
        }
    }

    function notifyShieldStop(side, x, y) {
        for (var i in spectators) {
            spectators[i].shieldStop(side, x, y);
        }
    }

    function getState() {
        var leftPlayerState = comps.Constants.PLAYER_STATE_FREE;
        var rightPlayerState = comps.Constants.PLAYER_STATE_FREE;

        if (players.left) {
            leftPlayerState = comps.Constants.PLAYER_STATE_CONNECTED;
        }
        if (players.right) {
            rightPlayerState = comps.Constants.PLAYER_STATE_CONNECTED;
        }

        return {
            game: gameState,
            leftPlayer: leftPlayerState,
            rightPlayer: rightPlayerState
        };
    }

    function start() {
        bindPlayerToShield(players.left, shields.left);
        bindPlayerToShield(players.right, shields.right);

        stage.addDynamicElement(shields.left)
             .addDynamicElement(shields.right)
             .addDynamicElement(ball)
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
        joinPlayer: joinPlayer
    };
};
