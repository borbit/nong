var pong = require('../shared/pong'),
    comps = require('../shared/components'),
    utils = require('../shared/utils'),
    Player = require('./player');

exports.createGame = function() {
    var spectators = {};
    var players = {left: null, right: null};
    var gameState = comps.Constants.GAME_STATE_WAITING_FOR_PLAYERS;
    var snapshotter = null;

    var stage = pong.Stage();
    var ball = new pong.Ball('ball');
    var shields = {
        left: new pong.Shield(40, 20, 'left'),
        right: new pong.Shield(750, 20, 'right')
    };

    stage.addStaticElement(new pong.StageWall(0, -50, 800))
         .addStaticElement(new pong.StageWall(0, 600, 800))
         .addStaticElement(new pong.Goal(-50, 0, 600))
         .addStaticElement(new pong.Goal(800, 0, 600))
         .addShield(shields.left)
         .addShield(shields.right)
         .addDynamicElement(ball);

    stage.subscribe(pong.Stage.events.goalHit, function(goal) {
        restartGame();
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
        player.on(Player.events.PING, function(key) {
            player.pong(key);
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

        player.ping();

        player.on(Player.events.GONE, function() {
            players[side] = null;
            updateGameState();
        });

        player.on(Player.events.MOVEUP, function(key) {
            notifyShieldMoveUp(side, shields[side].region.x, shields[side].region.y, shields[side].energy);
            player.shieldMovedUp(side, shields[side].region.x, shields[side].region.y, shields[side].energy, key)
        });
        player.on(Player.events.MOVEDOWN, function(key) {
            notifyShieldMoveDown(side, shields[side].region.x, shields[side].region.y, shields[side].energy);
            player.shieldMovedDown(side, shields[side].region.x, shields[side].region.y, shields[side].energy, key)
        });
        player.on(Player.events.STOP, function(key, y) {
            shields[side].region.y = y;
            notifyShieldStop(side, shields[side].region.x, shields[side].region.y);
            player.shieldStoped(side, shields[side].region.x, shields[side].region.y, key)
        });

        bindPlayerToShield(players[side], shields[side]);

        updateGameState();
    }

    function updateGameState() {
        if (players.left && players.right) {
            gameState = comps.Constants.GAME_STATE_IN_PROGRESS;
            startGame();
        } else if (gameState == comps.Constants.GAME_STATE_IN_PROGRESS) {
            gameState = comps.Constants.GAME_STATE_WAITING_FOR_PLAYERS;
            stopGame();
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

    function notifyShieldMoveUp(side, x, y, energy) {
        for (var i in spectators) {
            spectators[i].shieldMoveUp(side, x, y, energy);
        }
    }

    function notifyShieldMoveDown(side, x, y, energy) {
        for (var i in spectators) {
            spectators[i].shieldMoveDown(side, x, y, energy);
        }
    }

    function notifyShieldStop(side, x, y) {
        for (var i in spectators) {
            spectators[i].shieldStop(side, x, y);
        }
    }

    function notifyRoundStarted(ballData) {
        for (var i in spectators) {
            spectators[i].roundStarted(ballData);
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

    function bindPlayerToShield(player, shield) {
        player.subscribe(Player.events.STOP, function() { shield.stop(); });
        player.subscribe(Player.events.MOVEUP, function() { shield.moveUp(); });
        player.subscribe(Player.events.MOVEDOWN, function() { shield.moveDown(); });
    }

    function startGame() {
        ball.preparePitch();

        notifyRoundStarted({
            ball: ball.serialize(),
            countdown: pong.Globals.COUNTDOWN
        });

        setTimeout(function() {
            ball.pitch();

            snapshotter = setInterval(function(elements) {
                notifyElementsChanged(stage.getState());
            }, 1000 / pong.Globals.SPS);
            
        }, pong.Globals.COUNTDOWN * 1000);

        stage.start();
    }

    function restartGame() {
        stopGame();
        startGame();
    }

    function stopGame() {
        stage.stop();
        clearInterval(snapshotter);
    }

    return {
        joinPlayer: joinPlayer
    };
};
