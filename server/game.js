var pong = require('../shared/pong'),
    comps = require('../shared/components'),
    utils = require('../shared/utils'),
    Players = require('./players'),
    Player = require('./player');

exports.create = function(config) {
    return new Game(config);
};

function Game(config) {
    Game.superproto.constructor.call(this);

    this.config = config;
    
    this.players = Players.create();
    this.active = {left: null, right: null};
    this.scores = {left: 0, right: 0};
    this.gameState = comps.Constants.GAME_STATE_WAITING_FOR_PLAYERS;
    this.snapshotter = null;
    this.reset();
    
    var game = this;
    
    this.stage.subscribe(pong.Stage.events.goalHit, function(goal) {
        for (var key in game.goals) {
            if (game.goals[key] == goal) {
                game.scores[key] += 1;

                game.players.scoresChanged({
                    scores: game.scores
                });
            }
        }

        if (game.canBeFinished()) {
            game.finish();
        }
        else {
            game.restartRound();
        }
    });
}

utils.inherit(Game, pong.Game);

Game.prototype.joinPlayer = function(player) {
    var that = this;
    that.players.add(player);

    player.on(Player.events.GONE, function() { that.players.remove(player.id); });
    player.on(Player.events.JOINLEFT, function() { that.assignShield('left', player); });
    player.on(Player.events.JOINRIGHT, function() { that.assignShield('right', player); });
    player.on(Player.events.PING, function(key) { player.pong(key); });

    player.gameState(that.getState());
};

Game.prototype.assignShield = function(side, player) {
    if (!utils._.isNull(this.active[side])) {
        return;
    }

    var game = this;

    player.on(Player.events.GONE, function() {
        game.pause();
        game.reset();
        game.active[side] = null;
        game.updateGameState();
    });

    var shield = game.shields[side];

    player.on(Player.events.MOVEUP, function(key) {
        shield.moveUp();
        game.players.shieldMoveUp(side, shield.region.y);
        player.shieldMovedUp(side, shield.region.y, key)
    });
    player.on(Player.events.MOVEDOWN, function(key) {
        shield.moveDown();
        game.players.shieldMoveDown(side, shield.region.y);
        player.shieldMovedDown(side, shield.region.y, key)
    });
    player.on(Player.events.STOP, function(key) {
        shield.stop();
        game.players.shieldStop(side, shield.region.y);
        player.shieldStoped(side, shield.region.y, key)
    });

    game.active[side] = player;
    game.updateGameState();
};

Game.prototype.updateGameState = function() {
    if (this.active.left && this.active.right) {
        this.gameState = comps.Constants.GAME_STATE_IN_PROGRESS;
        this.startRound();
    } else if (this.gameState == comps.Constants.GAME_STATE_IN_PROGRESS) {
        this.gameState = comps.Constants.GAME_STATE_WAITING_FOR_PLAYERS;
        this.pause();
    }

    this.players.gameState(this.getState());
};

Game.prototype.getState = function() {
    var c = comps.Constants;

    return {
        game: this.gameState,
        players: {
            'left': this.active.left ? c.PLAYER_STATE_CONNECTED : c.PLAYER_STATE_FREE,
            'right': this.active.right ? c.PLAYER_STATE_CONNECTED : c.PLAYER_STATE_FREE
        }
    };
};

Game.prototype.startRound = function() {
    var that = this;
    that.ball.preparePitch();

    that.players.roundStarted({
        shields: {
            left: that.shields.left.serialize(),
            right: that.shields.right.serialize()
        },
        ball: that.ball.serialize(),
        countdown: pong.Globals.COUNTDOWN
    });

    setTimeout(function() {
        that.ball.pitch();

        that.snapshotter = setInterval(function(elements) {
            that.players.gameSnapshot(that.stage.serialize());
        }, 1000 / pong.Globals.SPS);

    }, pong.Globals.COUNTDOWN * 1000);

    that.stage.start();
};

Game.prototype.pause = function() {
    this.stage.stop();
    clearInterval(this.snapshotter);
};

Game.prototype.restartRound = function() {
    this.pause();
    this.startRound();
};

Game.prototype.canBeFinished = function() {
    for (var key in this.scores) {
        if (this.scores[key] >= this.config.ROUNDS_TO_WIN) {
            return true;
        }
    }

    return false;
};

Game.prototype.getWinner = function() {
    var winner = null;

    for (var key in this.scores) {
        if (this.scores[key] >= this.config.ROUNDS_TO_WIN) {
            winner = key;
            break;
        }
    }
    
    return winner;
};

Game.prototype.finish = function() {
    this.pause();
    this.players.gameFinished({
        winner: this.getWinner()
    });
}

Game.prototype.reset = function() {
    this.shields.left.region.y = 250;
    this.shields.right.region.y = 250;
    this.scores.left = 0;
    this.scores.right = 0;
};