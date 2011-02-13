var pong = require('../shared/pong'),
    comps = require('../shared/components'),
    utils = require('../shared/utils'),
    Players = require('./players'),
    Player = require('./player');

exports.create = function() {
    return new Game();
};

function Game() {
    Game.superproto.constructor.call(this);
    
    this.players = Players.create();
    this.active = {left: null, right: null};
    this.scores = {left: 0, right: 0};
    this.gameState = comps.Constants.GAME_STATE_WAITING_FOR_PLAYERS;
    this.snapshotter = null;
    this.resetGame();
    
    var that = this;
    
    this.stage.subscribe(pong.Stage.events.goalHit, function(goal) {
        for (var key in that.goals) {
            if (that.goals[key] == goal) {
                that.scores[key] += 1;
            }
        }
        that.restartGame();
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

    var that = this;

    player.on(Player.events.GONE, function() {
        that.stopGame();
        that.resetGame();
        that.active[side] = null;
        that.updateGameState();
    });

    var shield = that.shields[side];

    player.on(Player.events.MOVEUP, function(key) {
        shield.moveUp();
        that.players.shieldMoveUp(side, shield.region.y);
        player.shieldMovedUp(side, shield.region.y, key)
    });
    player.on(Player.events.MOVEDOWN, function(key) {
        shield.moveDown();
        that.players.shieldMoveDown(side, shield.region.y);
        player.shieldMovedDown(side, shield.region.y, key)
    });
    player.on(Player.events.STOP, function(key) {
        shield.stop();
        that.players.shieldStop(side, shield.region.y);
        player.shieldStoped(side, shield.region.y, key)
    });

    that.active[side] = player;
    that.updateGameState();
};

Game.prototype.updateGameState = function() {
    if (this.active.left && this.active.right) {
        this.gameState = comps.Constants.GAME_STATE_IN_PROGRESS;
        this.startGame();
    } else if (this.gameState == comps.Constants.GAME_STATE_IN_PROGRESS) {
        this.gameState = comps.Constants.GAME_STATE_WAITING_FOR_PLAYERS;
        this.stopGame();
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

Game.prototype.startGame = function() {
    var that = this;
    that.ball.preparePitch();

    that.players.roundStarted({
        shields: {
            left: that.shields.left.serialize(),
            right: that.shields.right.serialize()
        },
        ball: that.ball.serialize(),
        countdown: pong.Globals.COUNTDOWN,
        scores: that.scores
    });

    setTimeout(function() {
        that.ball.pitch();

        that.snapshotter = setInterval(function(elements) {
            that.players.gameSnapshot(that.stage.serialize());
        }, 1000 / pong.Globals.SPS);

    }, pong.Globals.COUNTDOWN * 1000);

    that.stage.start();
};

Game.prototype.stopGame = function() {
    this.stage.stop();
    clearInterval(this.snapshotter);
};

Game.prototype.restartGame = function() {
    this.stopGame();
    this.startGame();
};

Game.prototype.resetGame = function() {
    this.shields.left.region.y = 250;
    this.shields.right.region.y = 250;
    this.scores.left = 0;
    this.scores.right = 0;
};