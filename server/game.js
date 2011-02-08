var pong = require('../shared/pong'),
    comps = require('../shared/components'),
    utils = require('../shared/utils'),
    Player = require('./player');

exports.createGame = function() {
    var spectators = {};
    var players = {left: null, right: null};
    var gameState = comps.Constants.GAME_STATE_WAITING_FOR_PLAYERS;
    var snapshotter = null;

    var scores = {
        left: 0,
        right: 0
    };
    
    var stage = pong.Stage();
    var ball = new pong.Ball('ball');
    var shields = {
        left: new pong.Shield(40, 20, 'left'),
        right: new pong.Shield(750, 20, 'right')
    };
    var goals = {
        left: new pong.Goal(-50, 0, 600),
        right: new pong.Goal(800, 0, 600)
    };

    stage.addStaticElement(new pong.StageWall(0, -50, 800))
         .addStaticElement(new pong.StageWall(0, 600, 800))
         .addStaticElement(goals.left)
         .addStaticElement(goals.right)
         .addShield(shields.left)
         .addShield(shields.right)
         .addDynamicElement(ball);

    stage.subscribe(pong.Stage.events.goalHit, function(goal) {
        updateScores(goal);
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

            if(!utils._.isNull(players.right)) {
                players.right.opponentConnected('left');
            }
        });
        player.on(Player.events.JOINRIGHT, function() {
            assignShield('right', player);

            if(!utils._.isNull(players.left)) {
                players.left.opponentConnected('right');
            }
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

        var shield = shields[side];

        player.on(Player.events.MOVEUP, function(key) {
            notifyShieldMoveUp(side, shield.region.y, shield.energy);
            player.shieldMovedUp(side, shield.region.y, key)
        });
        player.on(Player.events.MOVEDOWN, function(key) {
            notifyShieldMoveDown(side, shield.region.y, shield.energy);
            player.shieldMovedDown(side, shield.region.y, key)
        });
        player.on(Player.events.STOP, function(key, y) {
            notifyShieldStop(side, shield.region.y);
            player.shieldStoped(side, shield.region.y, key)
        });

        bindPlayerToShield(player, shield);

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

    function notifyShieldMoveUp(side, y, energy) {
        for (var i in spectators) {
            spectators[i].shieldMoveUp(side, y, energy);
        }
    }

    function notifyShieldMoveDown(side, y, energy) {
        for (var i in spectators) {
            spectators[i].shieldMoveDown(side, y, energy);
        }
    }

    function notifyShieldStop(side, y) {
        for (var i in spectators) {
            spectators[i].shieldStop(side, y);
        }
    }

    function notifyRoundStarted(data) {
        for (var i in spectators) {
            spectators[i].roundStarted(data);
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
            countdown: pong.Globals.COUNTDOWN,
            scores: scores
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

    function updateScores(goal) {
        for (var key in goals) {
            if (goals[key] == goal) {
                scores[key] += 1;
            }
        }
    }

    function stopGame() {
        stage.stop();
        clearInterval(snapshotter);
    }

    return {
        joinPlayer: joinPlayer
    };
};
